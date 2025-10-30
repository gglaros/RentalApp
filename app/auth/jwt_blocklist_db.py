from datetime import datetime, timezone
from flask_jwt_extended import JWTManager
from app.database.db.session import get_session  # ή όπως λέγεται ο helper σου
from app.repositories.revoked_tokens_repository import RevokedTokensRepository

def _exp_to_datetime_utc(exp: int) -> datetime:
    return datetime.fromtimestamp(exp, tz=timezone.utc).replace(tzinfo=None)

def init_jwt_blocklist_db(app, jwt: JWTManager):
    
    @jwt.token_in_blocklist_loader
    def _check_blocklist(jwt_header, jwt_payload):
        jti = jwt_payload.get("jti")
        with get_session() as s:
            repo = RevokedTokensRepository(s)
            return repo.is_revoked(jti)

    @jwt.revoked_token_loader
    def _revoked_response(jwt_header, jwt_payload):
        return {"error": "Token has been revoked."}, 401

    app.logger.info("✅ DB blocklist initialized (revoked_tokens).")


