from flask import Blueprint, jsonify
from flask_cors import cross_origin
from app.database.db.session import session_scope
from app.api.http import use_schema
from app.api.schemas.users import *
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
    
    
    
@bp.post("/login")
@use_schema(UserLoginSchema)
def login(payload):
    with session_scope():
        return AuthService().login(**payload)
    
    
@bp.get("/me")                                   # user profile
@authenticate(require_user=True)
def get_me(userAuth):
    user = UsersService().get(userAuth.id)
    schema=AuthService().get_schemas_by_user(user)
    return jsonify(schema.dump(user))    
    
    
@bp.post("/logout")
@authenticate(require_user=True)
def logout(userAuth):
    with session_scope():
        return AuthService().logout(userAuth)    
    



@bp.put("edit/<int:user_id>")
@use_schema(UserUpdateSchema)
@authenticate(require_user=True)
def update_user(payload, user_id: int, userAuth):
    with session_scope():
        user = UsersService().update(userAuth, user_id, **payload)
        return jsonify(UserOutSchema().dump(user)), 200


