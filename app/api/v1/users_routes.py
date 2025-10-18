from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.db.session import get_session
from app.db.session import session_scope
from app.api.http import use_schema
from app.schemas.users import UserCreateSchema, UserOutSchema,UserUpdateSchema
from app.services.users_service import UsersService

bp = Blueprint("users", __name__)

@bp.post("/")
@use_schema(UserCreateSchema)
def register(payload):
    with session_scope():
        svc = UsersService(get_session())
        user = svc.register(**payload)
        return jsonify(UserOutSchema().dump(user)), 201
    
    

@bp.get("/<int:user_id>")
def get_user(user_id: int):
    session = get_session()
    svc = UsersService(session)
    user = svc.get(user_id)
    if not user:
        return jsonify({"error": "Not found"}), 404
    return jsonify(UserOutSchema().dump(user))

@bp.get("/")
def list_users():
    session = get_session()
    svc = UsersService(session)
    users = svc.list()
    return jsonify(UserOutSchema(many=True).dump(users))





@bp.put("/<int:user_id>")
@use_schema(UserUpdateSchema)
def update_user(payload, user_id: int):
    with session_scope():
        svc = UsersService(get_session())
        user = svc.update(user_id, **payload)
        return jsonify(UserOutSchema().dump(user)), 200





@bp.delete("/<int:user_id>")
def delete_user(user_id: int):
    session = get_session()
    svc = UsersService(session)
    try:
        svc.delete(user_id)
        return jsonify({"message": f"User {user_id} deleted"}), 200
    except ValueError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 404