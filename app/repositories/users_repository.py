from sqlalchemy import select
from app.models.users import User

class UsersRepository:
    def __init__(self, session):
        self.session = session

    def create(self, user: User) -> User:
        self.session.add(user)
        self.session.flush()
        return user

    def get(self, user_id: int) -> User | None:
        return self.session.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        return self.session.execute(stmt).scalar_one_or_none()

    def list(self, limit=50, offset=0) -> list[User]:
        stmt = select(User).limit(limit).offset(offset)
        return list(self.session.execute(stmt).scalars())



    def update(self, user_id: int, **fields) -> User | None:
        user = self.get(user_id)
        if not user:
            return None
        for key, value in fields.items():
            setattr(user, key, value)
        self.session.flush()
        return user

   
    def delete(self, user_id: int) -> bool:
        user = self.get(user_id)
        if not user:
            return False
        self.session.delete(user)
        self.session.flush()
        return True