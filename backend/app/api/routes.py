from flask import request, jsonify, current_app
from . import api
from .models import Grant, Tag
from .schemas import grants_input_schema, grants_output_schema
from app.extensions import db
from app.services.tagging_service import simple_string_match_tagger
from marshmallow import ValidationError


@api.route("/health", methods=["GET"])
def health_check():
    """Endpoint simple para verificar que la API está viva."""
    return jsonify({"status": "healthy"}), 200


@api.route("/grants", methods=["GET"])
def get_grants():
    """
    Obtiene todos los grants.
    Soporta filtrado por tag: /api/grants?tag=agriculture
    """
    tag_filter = request.args.get("tag")

    query = Grant.query

    if tag_filter:
        # Gracias a la relación M2M, este filtro es eficiente
        query = query.join(Grant.tags).filter(Tag.name == tag_filter)

    all_grants = query.order_by(Grant.grant_name.asc()).all()

    # Serializamos los objetos Grant a JSON
    return jsonify(grants_output_schema.dump(all_grants)), 200


@api.route("/grants", methods=["POST"])
def add_grants():
    """
    Añade una lista de nuevos grants al sistema.
    Espera un JSON: [{...}, {...}]
    """
    json_data = request.get_json()
    if not json_data:
        return jsonify({"error": "No input data provided"}), 400

    # 1. Validar el JSON de entrada
    try:
        validated_data = grants_input_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    new_grants_list = []

    # 2. Procesar cada grant en la lista
    for grant_data in validated_data:
        # Evitar duplicados por nombre
        if Grant.query.filter_by(grant_name=grant_data["grant_name"]).first():
            continue  # Opcional: podrías devolver un error/warning

        # 3. Aplicar la lógica de Tagging
        tag_names = simple_string_match_tagger(
            grant_data["grant_description"], grant_data["grant_name"]
        )

        # 4. Obtener o crear los objetos Tag en la DB
        tag_objects = []
        for name in tag_names:
            tag = Tag.query.filter_by(name=name).first()
            if not tag:
                # El tagger solo devuelve tags predefinidos,
                # pero si no existe en la DB, lo creamos.
                tag = Tag(name=name)
                db.session.add(tag)
            tag_objects.append(tag)

        # 5. Crear el nuevo objeto Grant
        new_grant = Grant(
            grant_name=grant_data["grant_name"],
            grant_description=grant_data["grant_description"],
            tags=tag_objects,
        )
        db.session.add(new_grant)
        new_grants_list.append(new_grant)

    # 6. Guardar todo en la base de datos
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error al guardar en DB: {e}")
        return jsonify({"error": "Error interno al guardar los grants"}), 500

    # 7. Devolver los grants recién creados (serializados)
    return jsonify(grants_output_schema.dump(new_grants_list)), 201


@api.route("/tags", methods=["GET"])
def get_all_tags():
    """
    Endpoint útil para el frontend.
    Devuelve la lista de todos los tags predefinidos para
    construir la UI de filtros.
    """
    tags_list = current_app.config["PREDEFINED_TAGS"]
    return jsonify(sorted(tags_list)), 200
