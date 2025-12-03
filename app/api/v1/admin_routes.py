from flask import Blueprint, request, jsonify,Response,json
from marshmallow import ValidationError
from app.database.db.session import session_scope
from app.api.schemas.users import UserCreateSchema, UserOutSchema,UserUpdateSchema
from app.api.schemas.owner_schema import OwnerSchema
from app.api.schemas.owner_application import  OwnerApplicationOutSchema,OwnerApplicationUpdateSchema
from app.api.schemas.properties import PropertyOutSchema
from app.services.users_service import UsersService
from app.services.owner_service import OwnerService
from app.services.auth_service import AuthService
from app.api.http import use_schema,response_schema
from app.auth.admin import admin_authenticate
from app.auth.decorators import authenticate


bp = Blueprint("admin", __name__)


       
@bp.get("/<int:user_id>")                                 #profile
@admin_authenticate(require_admin=True)
def get_user(user_id: int):
    user = UsersService().get(user_id)
    schema=AuthService().get_schemas_by_user(user)
    return jsonify(schema.dump(user))



@bp.get("/users")
@admin_authenticate(require_admin=True)
def list_users():
    users = UsersService().list()
    return jsonify(UserOutSchema(many=True).dump(users))



@bp.delete("/<int:user_id>")
@admin_authenticate(require_admin=True)
def delete_user(user_id:int ):
    with session_scope():
        result = UsersService().force_delete_user(user_id)
        return jsonify(result), 202
    
    
    
    
@bp.patch("/change/status/<int:app_id>")
@use_schema(OwnerApplicationUpdateSchema)
@admin_authenticate(require_admin=True)
def update_owner_application_status(payload, app_id):
    with session_scope():
        owner_app = OwnerService().update_owner_application_status(app_id, **payload)
        return jsonify(OwnerApplicationOutSchema().dump(owner_app)), 200
    


@bp.get("/all/ownerApps")
@admin_authenticate(require_admin=True)
def list_owner_applications():
    owner_apps = OwnerService().list_owner_applications()
    return Response(json.dumps(OwnerApplicationOutSchema(many=True).dump(owner_apps), sort_keys=False), mimetype="application/json"), 200
