from flask import Blueprint, request, jsonify,g
from marshmallow import ValidationError
from app.database.db.session import get_session
from app.database.db.session import session_scope
from werkzeug.security import check_password_hash
import jwt
from app.auth.token import SECRET_KEY, ALGORITHM
import hashlib
from datetime import datetime, timezone
from app.common.exceptions import BadRequestError, UnauthorizedError
from app.repositories.users_repository import UsersRepository
from flask_jwt_extended import create_access_token,verify_jwt_in_request, get_jwt_identity
from termcolor import colored
from app.repositories.users_repository import UsersRepository
from app.api.schemas.users import UserCreateSchema, UserOutSchema,UserUpdateSchema
from app.api.schemas.owner_schema import OwnerSchema
from app.api.schemas.tenant_schema import TenantSchema
from app.repositories.revoked_tokens_repository import RevokedTokensRepository
import datetime
from app.auth.token import create_token,decode_token
from datetime import datetime, timedelta, timezone
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
    
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    
    def login(self, email: str, password: str):
        user = self.users_repo.get_by_email(email)
        
        if not user or not check_password_hash(user.password_hash, password):
            raise BadRequestError("Invalid email or password.")

        schema = self.get_schemas_by_user(user)
        token = create_token(user_id=user.id, role=user.role.value)
        
        print(colored (token , 'green'))
        decoded=decode_token(token)
        print(colored (f"decoded :{decoded} = "  , 'yellow'))
        print(colored (f"decoded sub = :{decoded["userId"] } "  , 'red'))
       
        
        return {"user": schema.dump(user), "token": token}, 200

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    
    def logout(self, user):
        if not user:
            return {"error": "unauthorized"}, 401

        token = request.headers.get("Authorization", "")
        
        if not token.startswith("Bearer "):
            return {"error": "Missing or invalid Authorization header"}, 401
        
        token=token.split(" ", 1)[1].strip()
        print(colored (token , 'yellow'))
        decoded=decode_token(token)
        user_id=decoded["userId"]  
        expires_at = datetime.fromtimestamp(decoded["exp"], tz=timezone.utc).replace(tzinfo=None) 
        
        with session_scope() as s:
            RevokedTokensRepository(s).add(
                jti=token,
                user_id=int(user_id) if user_id is not None else None,
                expires_at=expires_at
            )

        return {"message": "Token revoked successfully."}, 200
