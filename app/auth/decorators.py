from functools import wraps
from flask import request, jsonify
from app.repositories.users_repository import UsersRepository
from app.database.db.session import get_session
from flask_jwt_extended import get_jwt,get_jwt_identity,verify_jwt_in_request
from app.auth.token_utils import is_token_revoked   
import logging
logger = logging.getLogger(__name__)


def authenticate(require_user=False):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
           
            verify_jwt_in_request()
            
            
            claims = get_jwt()
            jti = claims.get("jti")
            if not jti or is_token_revoked(jti): 
                return jsonify({"error": "token_revoked"}), 401
            
            
            jti= get_jwt().get("jti")
            user_id = get_jwt_identity()
              
            user = UsersRepository(get_session()).get(user_id)
           
            if not user:
                return jsonify({"error": "User not found auth"}), 404
            
            return f(*args, userAuth=user, **kwargs)

        return wrapper
    return decorator
