from flask import Blueprint, request, jsonify,g
from marshmallow import ValidationError
from app.database.db.session import get_session
from app.database.db.session import session_scope
from werkzeug.security import check_password_hash
from app.common.exceptions import BadRequestError, UnauthorizedError
from app.repositories.users_repository import UsersRepository
from flask_jwt_extended import create_access_token,verify_jwt_in_request, get_jwt_identity
from app.repositories.users_repository import UsersRepository
from app.api.schemas.users import UserCreateSchema, UserOutSchema,UserUpdateSchema
from app.api.schemas.owner_schema import OwnerSchema
from app.api.schemas.tenant_schema import TenantSchema
from app.repositories.revoked_tokens_repository import RevokedTokensRepository
import datetime
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
    
    
    
    def login(self, email: str, password: str):
        user = self.users_repo.get_by_email(email)
        
        if not user or not check_password_hash(user.password_hash, password):
            raise BadRequestError("Invalid email or password.")

        schema = self.get_schemas_by_user(user)
        token= create_access_token(identity=str(user.id),additional_claims={"role": user.role.value}, expires_delta=timedelta(hours=1), )
        return {"user": schema.dump(user), "token": token}, 200
    
    
    def logout(self, user):
        if not user:
            return {"error": "unauthorized"}, 401

        jwt_payload = get_jwt() 
        jti = jwt_payload.get("jti")
        exp_ts = jwt_payload.get("exp")  
        
        print(f"[LOGOUT] token_type={jwt_payload.get('type')} jti={jwt_payload.get('jti')} exp={jwt_payload.get('exp')}")
        
        if not jti or not exp_ts:
            return {"error": "invalid_jwt"}, 400

        expires_at = datetime.fromtimestamp(exp_ts, tz=timezone.utc).replace(tzinfo=None)

        user_id = get_jwt_identity()
        with session_scope() as s:
            RevokedTokensRepository(s).add(
                jti=jti,
                user_id=int(user_id) if user_id is not None else None,
                expires_at=expires_at,
            )
            print(f"[LOGOUT] inserted revoke jti={jwt_payload.get('jti')}")

        return {"message": "Token revoked successfully."}, 200
 