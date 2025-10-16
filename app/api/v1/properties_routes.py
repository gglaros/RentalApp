from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.db.session import get_session
from app.schemas.properties import PropertyCreateSchema, PropertyOutSchema
from app.services.properties_service import PropertiesService

bp = Blueprint("properties", __name__)

@bp.post("/")
def create_property():
    try:
        payload = PropertyCreateSchema().load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    session = get_session()
    svc = PropertiesService(session)
    try:
        prop = svc.create(**payload)
    except ValueError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

    return jsonify(PropertyOutSchema().dump(prop)), 201

@bp.get("/<int:prop_id>")
def get_property(prop_id: int):
    session = get_session()
    svc = PropertiesService(session)
    prop = svc.get(prop_id)
    if not prop:
        return jsonify({"error": "Not found"}), 404
    return jsonify(PropertyOutSchema().dump(prop))

@bp.get("/")
def list_properties():
    owner_id = request.args.get("owner_id", type=int)
    session = get_session()
    svc = PropertiesService(session)
    props = svc.list(owner_id=owner_id)
    return jsonify(PropertyOutSchema(many=True).dump(props))
