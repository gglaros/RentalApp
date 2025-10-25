from functools import wraps
from flask import request, jsonify, g

from app.auth.token_utils import decode_token_and_get_user_id
from app.repositories.users_repository import UsersRepository
from app.database.db.session import get_session
from app.database.models.users import Role
import logging
logger = logging.getLogger(__name__)

def authenticate(require_owner=False):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            print("\033[91mMPIKA AUTH:\033")
            
            token = request.headers.get("Authorization")
            print("\033[91mTOKEN:\033", token)
            
            if not token or not token.startswith("Bearer "):
                return jsonify({"error": "Missing or invalid token"}), 401

            user_id = decode_token_and_get_user_id(token[7:])  # Χωρίς 'Bearer '
            print(f"\033[91mUSER ID FROM TOKEN:\033[0m {user_id}")
         
            
            user_repo = UsersRepository(get_session())
            user = user_repo.get(user_id)
            
            if not user:
                return jsonify({"error": "User not found auth"}), 404

            if require_owner and user.role != Role.OWNER:
                print("Only owners can perform this action", flush=True)
                logger.warning(f"Rejected: User {user.id} with role {user.role}")
                return jsonify({"error": "Only owners can perform this action"}), 403

           
            return f(*args, user=user, **kwargs)


        return wrapper
    return decorator
