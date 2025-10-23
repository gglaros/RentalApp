from flask import Blueprint, request, jsonify
from flask.views import MethodView
from marshmallow import ValidationError
from app.db.session import get_session
from app.db.session import session_scope
from app.schemas.properties import PropertyCreateSchema, PropertyOutSchema,PropertyUpdateSchema
from app.services.properties_service import PropertiesService
from flask import current_app
from app.common.exceptions import NotFoundError
from app.api.http import use_schema,response_schema


bp = Blueprint("properties",__name__)


@bp.post("/")
@use_schema(PropertyCreateSchema)
@response_schema(PropertyOutSchema)
def create_property(payload):
       with session_scope():  
        svc = PropertiesService()
        prop = svc.create(**payload)
        return prop


@bp.get("/<int:prop_id>")
@response_schema(PropertyOutSchema)
def get_property(prop_id: int):
   with session_scope(): 
    svc = PropertiesService()
    prop = svc.get(prop_id)
    return prop



@bp.get("/")
def list_all_properties():
    props = PropertiesService.list_all()
    return jsonify(PropertyOutSchema(many=True).dump(props))



@bp.get("/owner/<int:owner_id>")
def list_owner_properties(owner_id: int):
   with session_scope(): 
        props = PropertiesService().list_by_owner(owner_id)
        return jsonify(PropertyOutSchema(many=True).dump(props)), 200



@bp.put("/<int:prop_id>")
@use_schema(PropertyUpdateSchema)
def update_property(payload, prop_id: int):
   with session_scope(): 
        prop = PropertiesService().update(prop_id, **payload)
        return jsonify(PropertyOutSchema().dump(prop)), 200


@bp.delete("/<int:prop_id>")
def delete_property(prop_id: int):
   with session_scope():
       result = PropertiesService().delete(prop_id)
       return jsonify(result)


