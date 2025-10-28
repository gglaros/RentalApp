from flask import Blueprint, request, jsonify
from flask.views import MethodView
from marshmallow import ValidationError
from app.database.db.session import get_session
from app.database.db.session import session_scope
from app.api.schemas.properties import PropertyCreateSchema, PropertyOutSchema,PropertyUpdateSchema
from app.services.properties_service import PropertiesService
from flask import current_app
from app.common.exceptions import NotFoundError
from app.api.http import use_schema,response_schema
from app.auth.decorators import authenticate
from app.auth.admin import admin_authenticate


bp = Blueprint("properties",__name__)


@bp.post("/")
@authenticate(require_user=True)
@use_schema(PropertyCreateSchema)
def create_property(payload,userAuth):         # user from authenticate
       with session_scope(): 
        prop = PropertiesService().create(userAuth,**payload)
        return jsonify(PropertyOutSchema().dump(prop)), 201


@bp.get("/<int:prop_id>")
@response_schema(PropertyOutSchema)
def get_property(prop_id: int):
   with session_scope(): 
    prop = PropertiesService().get(prop_id)
    return prop



@bp.get("/")
@admin_authenticate(require_admin=True)
def list_all_properties():
    props = PropertiesService().list_all()  
    return jsonify(PropertyOutSchema(many=True).dump(props))



@bp.get("/owner/<int:owner_id>")
@authenticate(require_user=True)
def list_owner_properties(owner_id: int,userAuth):
   with session_scope(): 
        props = PropertiesService().list_by_owner(owner_id,userAuth)
        return jsonify(PropertyOutSchema(many=True).dump(props)), 200



@bp.put("/<int:prop_id>")
@authenticate(require_user=True)
@use_schema(PropertyUpdateSchema)
def update_property(payload, prop_id: int,userAuth):
   with session_scope(): 
        prop = PropertiesService().update(prop_id,userAuth, **payload)
        return jsonify(PropertyOutSchema().dump(prop)), 200



@bp.delete("/<int:prop_id>")
@authenticate(require_user=True)
def delete_property(prop_id: int,userAuth):
   with session_scope():
       result = PropertiesService().delete(prop_id,userAuth)
       return jsonify(result)


