from functools import wraps
from flask import jsonify,request
from app.common.exceptions import UnauthorizedError
from app.database.models.users import Role
from app.database.db.session import get_session, session_scope
from app.auth.token import decode_token
from termcolor import colored
from app.repositories.revoked_tokens_repository import RevokedTokensRepository
from app.repositories.users_repository import UsersRepository

def admin_authenticate(require_admin: bool = True):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if require_admin:
              token = request.headers.get("Authorization")
            
              if not token:
               return jsonify({"error": "Missing Authorization header"}), 401
          
              if not token.startswith("Bearer "):
                return jsonify({"error": "Invalid Authorization header"}), 401
           
              token=token.split(" ", 1)[1].strip()
             
              with session_scope() as s:
                revoked_repo = RevokedTokensRepository(s)
                if revoked_repo.is_revoked(token):
                 raise UnauthorizedError("Token has been revoked (logout detected malaka).")
              
              decoded=decode_token(token)
              print(colored(decoded,'red'))
              id=decoded["userId"]

            user = UsersRepository(get_session()).get(id)

            if not user:
                return jsonify({"error": "User not found in admin auth"}), 404

            if require_admin and user.role != Role.ADMIN:
                return jsonify({"error": "Only admins can access this"}), 403

            return f(*args,  **kwargs)
        return wrapper
    return decorator
