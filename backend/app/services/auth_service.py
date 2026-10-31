import logging
from app.database.db.session import get_session
from werkzeug.security import check_password_hash
from datetime import datetime, timezone
from app.common.exceptions import UnauthorizedError
from app.repositories.users_repository import UsersRepository
from app.api.schemas.users import UserOutSchema
from app.api.schemas.owner_schema import OwnerSchema
from app.api.schemas.tenant_schema import TenantSchema
from app.repositories.revoked_tokens_repository import RevokedTokensRepository
from app.auth.token import create_token,decode_token

logger = logging.getLogger(__name__)


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
            logger.warning("Failed login for %s", email)
            raise UnauthorizedError("Invalid email or password.")

        logger.info("User %s logged in (%s)", user.id, user.role.value)

        schema = self.get_schemas_by_user(user)
        token = create_token(user_id=user.id, role=user.role.value)

        decode_token(token)


        return {"user": schema.dump(user), "token": token}, 200


    def logout(self, user, token: str):
        decoded = decode_token(token)
        expires_at = datetime.fromtimestamp(decoded["exp"], tz=timezone.utc).replace(tzinfo=None)
        RevokedTokensRepository(self.session).add(
            jti=token,
            user_id=user.id,
            expires_at=expires_at,
        )
        logger.info("User %s logged out", user.id)
        return {"message": "Token revoked successfully."}, 200
