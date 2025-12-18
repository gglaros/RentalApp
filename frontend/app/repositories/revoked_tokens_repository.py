from datetime import datetime
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.database.models.revokedToken import RevokedToken

class RevokedTokensRepository:
    def __init__(self, session: Session):
        self.session = session

    def is_revoked(self, jti: str) -> bool:
        if not jti:
            return True
        stmt = select(RevokedToken.id).where(RevokedToken.jti == jti)
        print(self.session.execute(stmt).scalar())
        
        return self.session.execute(stmt).scalar() is not None

    def add(self, jti: str, user_id: int | None, expires_at: datetime) -> None:
        
        rt = RevokedToken(jti=jti, user_id=user_id, expires_at=expires_at)
        print(f"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Adding revoked token: {rt}")
        self.session.add(rt)
        try:
            self.session.commit()
        except IntegrityError:
            self.session.rollback()  

    def prune_expired(self) -> int:
       
        now = datetime.utcnow()
        stmt = delete(RevokedToken).where(RevokedToken.expires_at <= now)
        res = self.session.execute(stmt)
        self.session.commit()
        return res.rowcount or 0
