from flask import Blueprint, request, jsonify,g
from marshmallow import ValidationError
from app.database.db.session import get_session
from werkzeug.security import check_password_hash
from app.common.exceptions import BadRequestError, UnauthorizedError
from app.repositories.users_repository import UsersRepository
from app.database.db.redis import init_jwt_blocklist, redis_client,BLOCKLIST_EXPIRATION

from flask_jwt_extended import create_access_token
from app.repositories.users_repository import UsersRepository
from app.api.schemas.users import UserCreateSchema, UserOutSchema,UserUpdateSchema
from app.api.schemas.properties import PropertyOutSchema
from app.api.schemas.owner_schema import OwnerSchema
from app.api.schemas.tenant_schema import TenantSchema

import datetime
import jwt
from datetime import datetime, timedelta, timezone
from app.auth.admin import admin_authenticate
from app.auth.decorators import authenticate
from flask_jwt_extended import get_jwt



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
        token= create_access_token(identity=str(user.id),additional_claims={"role": user.role.value}, expires_delta=timedelta(hours=1), )
        return {"user": schema.dump(user), "token": token}, 200
    
    
    def logout(self, user):
        if not user:
            return jsonify({"error": "unauthorized"}), 401

        jti =  get_jwt().get("jti")
        exp =  get_jwt().get("exp")

        redis_client.setex(jti, BLOCKLIST_EXPIRATION, "revoked")
        return {"message": "Token revoked successfully."}, 200
        
 