from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.db.session import get_session
from app.db.session import session_scope
from app.schemas.properties import PropertyCreateSchema, PropertyOutSchema
from app.services.properties_service import PropertiesService
from flask import current_app
from app.common.exceptions import NotFoundError
from app.api.http import use_schema



bp = Blueprint("properties", __name__)



@bp.post("/")
@use_schema(PropertyCreateSchema)
def create_property(payload):
    with session_scope():
        svc = PropertiesService(get_session())
        prop = svc.create(**payload)
        
        return jsonify(PropertyOutSchema().dump(prop)), 201

@bp.get("/<int:prop_id>")
def get_property(prop_id: int):
    session = get_session()
    svc = PropertiesService(session)
    prop = svc.get(prop_id)
    return jsonify(PropertyOutSchema().dump(prop))

@bp.get("/")
def list_properties():
    owner_id = request.args.get("owner_id", type=int)
    svc = PropertiesService( get_session())
    props = svc.list(owner_id=owner_id)
  
    return jsonify(PropertyOutSchema(many=True).dump(props))


