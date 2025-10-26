from flask import Blueprint, current_app, request
from app.utils.api_response import error_response
from marshmallow import ValidationError
from werkzeug.exceptions import (
    BadRequest, 
    NotFound, 
    MethodNotAllowed, 
    InternalServerError,
    HTTPException # Catch-all for other HTTP errors
)

api = Blueprint('api', __name__)

# Importamos las rutas al final para evitar importaciones circulares
from . import routes


# --- REGISTER ERROR HANDLERS FOR THE 'api' BLUEPRINT ---
# By registering on the blueprint, we ensure any error
# raised from an API route is formatted as JSON.

@api.errorhandler(ValidationError)
def handle_marshmallow_validation(err):
    """Handles Marshmallow validation errors for the API."""
    current_app.logger.warning(f"Validation error for {request.path}: {err.messages}")
    return error_response(err.messages, "VALIDATION_ERROR", 400)

@api.errorhandler(BadRequest)
def handle_bad_request(e):
    """Handles 400 Bad Request errors for the API."""
    current_app.logger.warning(f"Bad Request ({e.description}) for {request.path}")
    return error_response(e.description, "BAD_REQUEST", 400)

@api.errorhandler(NotFound)
def handle_not_found(e):
    """Handles 404 Not Found errors for the API."""
    # 404s are common, so we can log at INFO level
    current_app.logger.info(f"404 - Resource not found: {request.path}")
    return error_response("Resource not found", "NOT_FOUND", 404)

@api.errorhandler(MethodNotAllowed)
def handle_method_not_allowed(e):
    """Handles 405 Method Not Allowed errors for the API."""
    current_app.logger.warning(f"405 - Method Not Allowed: {request.method} for {request.path}")
    return error_response("Method not allowed", "METHOD_NOT_ALLOWED", 405)

@api.errorhandler(InternalServerError)
def handle_internal_server_error(e):
    """Handles 500 Internal Server Error for the API."""
    # This is critical. We log with ERROR level and include the exception info.
    current_app.logger.error(f"Internal Server Error: {e}", exc_info=True)
    return error_response("An internal server error occurred", "INTERNAL_SERVER_ERROR", 500)

@api.errorhandler(HTTPException)
def handle_http_exception(e):
    """Handles generic HTTP exceptions (e.g., 401, 403, etc.)."""
    current_app.logger.warning(f"{e.code} {e.name}: {e.description}")
    return error_response(e.description, e.name.upper().replace(" ", "_"), e.code)

@api.errorhandler(Exception)
def handle_generic_exception(e):
    """
    Handles any other uncaptured exception (like 500)
    to ensure a JSON response.
    """
    # This is our catch-all. CRITICAL.
    current_app.logger.error(f"Unhandled Exception: {e}", exc_info=True)
    return error_response("An unexpected error occurred", "UNHANDLED_EXCEPTION", 500)