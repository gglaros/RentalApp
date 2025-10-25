from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.database.db.session import get_session
from app.database.db.session import session_scope
from app.api.http import use_schema
from app.api.schemas.users import UserCreateSchema, UserOutSchema,UserUpdateSchema
from app.services.users_service import UsersService

bp = Blueprint("users", __name__)

@bp.post("/")
@use_schema(UserCreateSchema)
def register(payload):
    with session_scope():
        return  UsersService().register(**payload)
       
    

@bp.get("/<int:user_id>")
def get_user(user_id: int):
    user = UsersService().get(user_id)
    return jsonify(UserOutSchema().dump(user))



@bp.get("/")
def list_users():
    users = UsersService().list()
    return jsonify(UserOutSchema(many=True).dump(users))


@bp.put("/<int:user_id>")
@use_schema(UserUpdateSchema)
def update_user(payload, user_id: int):
    with session_scope():
        user = UsersService().update(user_id, **payload)
        return jsonify(UserOutSchema().dump(user)), 200



@bp.delete("/<int:user_id>")
def delete_user(user_id: int):
    with session_scope():
        result = UsersService().force_delete_user(user_id)
        return jsonify(result), 202