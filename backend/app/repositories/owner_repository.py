from sqlalchemy import select
from app.database.models.users import User
from app.database.models.property import Property
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from app.api.errors import translate_integrity_error

class OwnerRepository:
    def __init__(self, session):
        self.session = session


    def list_owners(self, limit=50, offset=0) -> list[User]:
        stmt = select(User).where(User.role == 'OWNER').limit(limit).offset(offset)
        return list(self.session.execute(stmt).scalars())