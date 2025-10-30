from functools import wraps
from flask import request, jsonify
from flask import g
# from app.auth.token_utils import decode_token_and_get_user_id
from app.repositories.users_repository import UsersRepository
from app.database.db.session import get_session
from app.database.models.users import Role
import logging
from app.auth.token_utils import is_token_revoked  
from flask_jwt_extended import get_jwt,get_jwt_identity,verify_jwt_in_request

def admin_authenticate(require_admin=False):
   def decorator(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        jti = claims.get("jti")
        
        if not jti or is_token_revoked(jti): 
                return jsonify({"error": "token_revoked"}), 401
        
        jti= get_jwt().get("jti")
        print(f"!!!!!!!!!!!!!!!!!!!!!JTI from token: {jti}")
        user_id = get_jwt_identity()
        print(f"!!!!!!!!!!!!!!!!!!!!!JTI from user id !!: {user_id}")
         
        user = UsersRepository(get_session()).get(user_id)
        
        if not user:
         return jsonify({"error": "User not found in admin auth"}), 404
        
        if user.role != Role.ADMIN:
            return jsonify({"error": "Only admins can access this"}), 403
        
        
        return f(*args,**kwargs)
    return wrapper
   return decorator

#  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3NjE2MTk2MzJ9.yaM_yVtglFhvc7VxZKs4x5IRemlbzwvgQvHB3rFF4FU