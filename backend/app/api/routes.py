from threading import Thread
import traceback
from flask import request, current_app, abort
from . import api
from .models import Grant, Tag, grant_tags
from .schemas import (
    grants_input_schema, 
    grants_output_schema,
    grant_output_schema
)
from app.extensions import db
from app.services.tagging_service import tag_grant
from app.utils.api_response import success_response

def run_background_tagging(app, grant_ids):
    """
    This function runs in a separate thread.
    It iterates over the grant IDs, calls the LLM, and updates the DB.
    """
    with app.app_context():  # --- ! VERY IMPORTANT: Create an app context in the thread
        current_app.logger.info(f"[BG-TASK] Starting tagging for {len(grant_ids)} grants.")
        
        for grant_id in grant_ids:
            try:
                # Get the grant within the context
                grant = Grant.query.get(grant_id)
                if not grant:
                    current_app.logger.warning(f"[BG-TASK] Grant {grant_id} not found for tagging.")
                    continue

                current_app.logger.debug(f"[BG-TASK] Tagging grant: {grant.grant_name}")
                
                # --- The slow LLM call ---
                tag_names = tag_grant(
                    description=grant.grant_description,
                    grant_name=grant.grant_name
                )
                
                # Get or create Tag objects
                tag_objects = []
                for name in tag_names:
                    tag = Tag.query.filter_by(name=name).first()
                    if not tag:
                        tag = Tag(name=name)
                        db.session.add(tag)
                    tag_objects.append(tag)
                
                # Assign tags and save
                grant.tags = tag_objects
                db.session.commit()
                current_app.logger.info(f"[BG-TASK] Grant {grant_id} tagged successfully.")

            except Exception as e:
                db.session.rollback()
                current_app.logger.error(f"[BG-TASK] Failed to tag grant {grant_id}: {e}", exc_info=True)
        
        current_app.logger.info(f"[BG-TASK] Tagging process finished.")

@api.route('/health', methods=['GET'])
def health_check():
    """Simple endpoint to verify that the API is alive."""
    return success_response({"status": "healthy"}, "Health check successful", 200)

@api.route('/grants', methods=['GET'])
def get_grants():
    """
    Gets all grants with pagination and filtering.
    Supports:
    - Multiple tags: /api/grants?tag=agriculture&tag=rural
    - Partial name: /api/grants?name=sustainable
    - Pagination: /api/grants?page=0&size=20
    """
    # --- 1. Get query parameters ---
    
    # Pagination params (0-indexed)
    page = request.args.get('page', 0, type=int)
    size = request.args.get('size', 20, type=int)
    
    # Filter params
    tag_filters = request.args.getlist('tag')
    name_filter = request.args.get('name')

    query = Grant.query

    # --- 2. Apply filters ---
    if name_filter:
        query = query.filter(Grant.grant_name.ilike(f'%{name_filter}%'))

    if tag_filters:
        # Find grants that have ALL specified tags
        query = query.join(Grant.tags).filter(Tag.name.in_(tag_filters))
        query = query.group_by(Grant.id).having(db.func.count(Tag.id) == len(tag_filters))

    # --- 3. Apply Pagination ---
    # We add 1 to the page because Flask-SQLAlchemy's paginate is 1-indexed,
    # but our API standard is 0-indexed.
    try:
        paginated_result = query.order_by(Grant.grant_name.asc()).paginate(
            page=page + 1, 
            per_page=size, 
            error_out=False # Returns empty list if page is out of range
        )
    except Exception as e:
        current_app.logger.error(f"Pagination error: {e}\n{traceback.format_exc()}")
        abort(400, description="Invalid pagination parameters.")


    # --- 4. Serialize and Format Response ---
    serialized_content = grants_output_schema.dump(paginated_result.items)
    
    # Build the standardized Page<T> object
    page_data = {
        "content": serialized_content,
        "pageNo": page, # Return the 0-indexed page number
        "pageSize": paginated_result.per_page,
        "totalElements": paginated_result.total,
        "totalPages": paginated_result.pages,
        "last": not paginated_result.has_next
    }
    
    return success_response(page_data, "Grants retrieved successfully", 200)

@api.route('/grants/<int:grant_id>', methods=['GET'])
def get_grant(grant_id):
    """
    Gets a single grant by its ID.
    """
    # get_or_404 is a shortcut to get by ID or abort with a 404
    # if not found. Our global error handler will catch the 404.
    grant = Grant.query.get_or_404(grant_id)
    
    data = grant_output_schema.dump(grant)
    return success_response(data, "Grant retrieved successfully", 200)

@api.route('/grants', methods=['POST'])
def add_grants():
    """
    Adds a list of new grants to the system.
    Tagging is processed in the background.
    """
    json_data = request.get_json()
    if not json_data:
        abort(400, description="No input data provided")

    current_app.logger.debug("Validating JSON data...")
    validated_data = grants_input_schema.load(json_data)
    current_app.logger.debug(f"Validated {len(validated_data)} grants.")

    new_grants_list = []
    grant_ids_to_tag = [] # --- 3. List of IDs for the background thread
    
    for grant_data in validated_data:
        if Grant.query.filter_by(grant_name=grant_data['grant_name']).first():
            current_app.logger.debug(f"Skipping duplicate grant: {grant_data['grant_name']}")
            continue 

        current_app.logger.debug(f"Processing new grant: {grant_data['grant_name']}")
        
        # --- 4. Create the grant WITHOUT tags ---
        new_grant = Grant(
            grant_name=grant_data['grant_name'],
            grant_description=grant_data['grant_description'],
            tags=[]  # Created with an empty list
        )
        db.session.add(new_grant)
        new_grants_list.append(new_grant)

    # --- 5. Save grants to get their IDs ---
    try:
        # We 'flush' to get IDs without closing the transaction
        db.session.flush() 
        for grant in new_grants_list:
            grant_ids_to_tag.append(grant.id) # Save the new IDs
        
        db.session.commit() # Commit the new grants
        current_app.logger.info(f"Successfully created {len(new_grants_list)} grants (untagged).")
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error saving grants to DB: {e}\n{traceback.format_exc()}")
        abort(500, description="Internal error while saving grants")

    # --- 6. Start the background thread ---
    if grant_ids_to_tag:
        current_app.logger.info(f"Starting background tagging thread for {len(grant_ids_to_tag)} grants.")
        # Pass the real 'app' object and the list of IDs
        thread = Thread(
            target=run_background_tagging, 
            args=(current_app._get_current_object(), grant_ids_to_tag)
        )
        thread.daemon = True  # Allows the app to exit even if the thread is running
        thread.start()

    # --- 7. Respond immediately ---
    data = grants_output_schema.dump(new_grants_list)
    return success_response(data, f"{len(new_grants_list)} grants created. Tagging started in background.", 201)

@api.route('/tags', methods=['GET'])
def get_all_tags():
    """
    Returns the list of all predefined tags.
    """
    tags_list = current_app.config['PREDEFINED_TAGS']
    return success_response(sorted(tags_list), "Tags retrieved successfully", 200)


@api.route('/grants/clear-all', methods=['DELETE'])
def clear_all_grants():
    """
    Deletes ALL grants from the database.
    ⚠️ USE WITH CAUTION. Only works in development environment.
    """
    if current_app.config.get('FLASK_ENV') != 'development':
        current_app.logger.warning("Attempted to clear grants outside development environment.")
        abort(403, description="This operation is only allowed in the development environment.")

    try:
        # --- FIX: Delete from the association table FIRST ---
        # This prevents the ForeignKeyViolation
        db.session.execute(grant_tags.delete())
        
        # Now we can safely delete all grants
        num_deleted = Grant.query.delete()
        
        db.session.commit()
        current_app.logger.info(f"Successfully deleted {num_deleted} grants and cleared grant_tags.")
        return success_response(None, f"Successfully deleted {num_deleted} grants.", 200)
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error clearing grants: {e}\n{traceback.format_exc()}")
        abort(500, description="Internal error while clearing grants.")