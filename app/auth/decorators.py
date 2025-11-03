from functools import wraps
from flask import request, jsonify
from termcolor import colored
from app.repositories.revoked_tokens_repository import RevokedTokensRepository
from app.repositories.users_repository import UsersRepository
from app.database.db.session import get_session, session_scope
import jwt
from app.common.exceptions import  ConflictError, BadRequestError,NotFoundError, UnauthorizedError
from app.auth.token import decode_token
import logging
logger = logging.getLogger(__name__)


def authenticate(require_user=False):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
           
            token = request.headers.get("Authorization")
            
            if not token or not token.startswith("Bearer "):
             return jsonify({"error": "Missing or invalid Authorization header"}), 401
            
            token=token.split(" ", 1)[1].strip()
            
            with session_scope() as s:
             revoked_repo = RevokedTokensRepository(s)
             if revoked_repo.is_revoked(token):
              raise UnauthorizedError("Token has been revoked (logout detected malaka).") 
            
            decoded=decode_token(token)
            id=decoded["userId"]
            
            user = UsersRepository(get_session()).get(id)
            if not user:
                return jsonify({"error": "User not found auth"}), 404

            return f(*args, userAuth=user, **kwargs)
        return wrapper
    return decorator
