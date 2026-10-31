from sqlalchemy import select
from app.database.models.users import User

class OwnerRepository:
    def __init__(self, session):
        self.session = session


    def list_owners(self, limit=50, offset=0) -> list[User]:
        stmt = select(User).where(User.role == 'OWNER').limit(limit).offset(offset)
        return list(self.session.execute(stmt).scalars())
