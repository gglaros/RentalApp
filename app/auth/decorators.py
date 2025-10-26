from functools import wraps
from flask import request, jsonify, g
from app.auth.token_utils import decode_token_and_get_user_id
from app.repositories.users_repository import UsersRepository
from app.database.db.session import get_session
from app.database.models.users import Role
import logging
logger = logging.getLogger(__name__)

def authenticate(require_user=False):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = request.headers.get("Authorization")
            
            if not token or not token.startswith("Bearer "):
                return jsonify({"error": "Missing or invalid token"}), 401

            user_id = decode_token_and_get_user_id(token[7:]) 
              
            user = UsersRepository(get_session()).get(user_id)
           
            if not user:
                return jsonify({"error": "User not found auth"}), 404
            
            return f(*args, userAuth=user, **kwargs)

        return wrapper
    return decorator
