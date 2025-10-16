from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.db.session import get_session
from app.schemas.users import UserCreateSchema, UserOutSchema
from app.services.users_service import UsersService

bp = Blueprint("users", __name__)

@bp.post("/")
def register():
    try:
        payload = UserCreateSchema().load(request.get_json() or {})
    except ValidationError as err:
        print("se epiasa malaka")
        return jsonify({"errors": err.messages}), 400

    session = get_session()
    svc = UsersService(session)
    try:
        user = svc.register(**payload)
    except ValueError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

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
def update_user(user_id: int):
    session = get_session()
    svc = UsersService(session)
    try:
        data = request.get_json() or {}
        user = svc.update(user_id, **data)
        return jsonify(UserOutSchema().dump(user)), 200
    except ValueError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400





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