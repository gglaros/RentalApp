from flask import Blueprint, request, jsonify,g
from marshmallow import ValidationError
from app.database.db.session import get_session
from app.database.db.session import session_scope
from app.api.http import use_schema
from app.api.schemas.users import UserCreateSchema, UserOutSchema,UserUpdateSchema
from app.api.schemas.properties import PropertyOutSchema
from app.api.schemas.owner_schema import OwnerSchema
from app.api.schemas.tenant_schema import TenantSchema
from app.services.users_service import UsersService
from app.services.auth_service import AuthService
from app.auth.admin import admin_authenticate
from app.auth.decorators import authenticate

bp = Blueprint("users", __name__)

@bp.post("/")
@use_schema(UserCreateSchema)
def sign_up(payload):
    with session_scope():
        return  UsersService().sign_up(**payload)
       
      

@bp.get("/<int:user_id>")                                 #profile
@admin_authenticate(require_admin=True)
def get_user(user_id: int):
    user = UsersService().get(user_id)
    schema=AuthService().get_schemas_by_user(user)
    return jsonify(schema.dump(user))



@bp.get("/")
@admin_authenticate(require_admin=True)
def list_users():
    users = UsersService().list()
    return jsonify(UserOutSchema(many=True).dump(users))



@bp.put("/<int:user_id>")
@use_schema(UserUpdateSchema)
@authenticate(require_user=True)
def update_user(payload, user_id: int, userAuth):
    with session_scope():
        user = UsersService().update(userAuth, user_id, **payload)
        return jsonify(UserOutSchema().dump(user)), 200



@bp.delete("/<int:user_id>")
@admin_authenticate(require_admin=True)
def delete_user(user_id:int ):
    with session_scope():
        result = UsersService().force_delete_user(user_id)
        return jsonify(result), 202
    