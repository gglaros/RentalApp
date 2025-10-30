from flask import Blueprint, request, jsonify,g
from marshmallow import ValidationError
from app.database.db.session import get_session
from werkzeug.security import check_password_hash
from app.common.exceptions import BadRequestError, UnauthorizedError
from app.repositories.users_repository import UsersRepository
# from app.auth.token_utils import create_access_token
from flask_jwt_extended import create_access_token
from app.repositories.users_repository import UsersRepository
from app.api.schemas.users import UserCreateSchema, UserOutSchema,UserUpdateSchema
from app.api.schemas.properties import PropertyOutSchema
from app.api.schemas.owner_schema import OwnerSchema
from app.api.schemas.tenant_schema import TenantSchema
# from app.auth.token_utils import SECRET_KEY, ALGORITHM
import jwt
from datetime import datetime, timezone
from app.auth.admin import admin_authenticate
from app.auth.decorators import authenticate
from flask_jwt_extended import get_jwt
from app.auth.token_utils import revoke_jti


class AuthService:
    def __init__(self):
        self.session = get_session() 
        self.users_repo = UsersRepository(get_session())
       

    def get_schemas_by_user(self, user):
        if user.role.name == "OWNER":
            schema = OwnerSchema()
        elif user.role.name == "TENANT":
            schema = TenantSchema()
        else:
            schema = UserOutSchema()
        return schema
    
    
    
    def login(self, email: str, password: str):
        user = self.users_repo.get_by_email(email)
        
        if not user or not check_password_hash(user.password_hash, password):
            raise BadRequestError("Invalid email or password.")

        schema = self.get_schemas_by_user(user)
        token = create_access_token(user.id, user.role.name)
        return {"user": schema.dump(user), "token": token}, 200
    
    
    def logout(self, user):
        if not user:
            return jsonify({"error": "unauthorized"}), 401

        jti =  get_jwt().get("jti")
        exp =  get_jwt().get("exp")

        if not jti or not exp:
            return jsonify({"error": "invalid_token"}), 400

        revoke_jti(jti, exp)
        return jsonify({"message": "Logout successful."}), 200
        
 