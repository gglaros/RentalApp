from functools import wraps
from flask import request, jsonify
from flask import g
from app.auth.token_utils import decode_token_and_get_user_id
from app.repositories.users_repository import UsersRepository
from app.database.db.session import get_session
from app.database.models.users import Role
import logging


def admin_authenticate(require_admin=False):
   def decorator(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        
        if not token or not token.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid token"}), 401

        user_id = decode_token_and_get_user_id(token[7:]) 
        
        user = UsersRepository(get_session()).get(user_id)
        
        if not user:
         return jsonify({"error": "User not found in admin auth"}), 404
        
        if user.role != Role.ADMIN:
            return jsonify({"error": "Only admins can access this"}), 403
        
        
        return f(*args,**kwargs)
    return wrapper
   return decorator

#  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3NjE2MTk2MzJ9.yaM_yVtglFhvc7VxZKs4x5IRemlbzwvgQvHB3rFF4FU