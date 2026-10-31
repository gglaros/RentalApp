import hashlib
from datetime import datetime
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from app.database.models.revokedToken import RevokedToken


def _fingerprint(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


class RevokedTokensRepository:
    def __init__(self, session: Session):
        self.session = session

    def is_revoked(self, token: str) -> bool:
        if not token:
            return True
        stmt = select(RevokedToken.id).where(RevokedToken.jti == _fingerprint(token))
        return self.session.execute(stmt).scalar() is not None

    def add(self, jti: str, user_id: int | None, expires_at: datetime) -> None:
        fingerprint = _fingerprint(jti)
        if self.is_revoked(jti):
            return
        self.session.add(RevokedToken(jti=fingerprint, user_id=user_id, expires_at=expires_at))
        self.session.flush()

    def prune_expired(self) -> int:
        now = datetime.utcnow()
        stmt = delete(RevokedToken).where(RevokedToken.expires_at <= now)
        res = self.session.execute(stmt)
        return res.rowcount or 0
