from werkzeug.security import generate_password_hash
from app.models.users import User, Role
from app.repositories.users_repository import UsersRepository

class UsersService:
    def __init__(self, session):
        self.repo = UsersRepository(session)
        self.session = session

    def register(self, *, email: str, password: str, role: str, **profile) -> User:
        if self.repo.get_by_email(email):
            raise ValueError("Email already in use")

        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            role=Role[role.upper()],
            first_name=profile.get("first_name"),
            last_name=profile.get("last_name"),
            phone=profile.get("phone"),
        )
        self.repo.create(user)
        self.session.commit()
        return user

    def get(self, user_id: int) -> User | None:
        return self.repo.get(user_id)

    def list(self, limit=50, offset=0):
        return self.repo.list(limit=limit, offset=offset)



    def update(self, user_id: int, **fields) -> User:
        user = self.repo.get(user_id)
        if not user:
            raise ValueError("User not found")

        # προστατεύουμε κάποια πεδία
        protected = {"id", "password_hash", "created_at"}
        for k in list(fields.keys()):
            if k in protected:
                fields.pop(k)

        updated_user = self.repo.update(user_id, **fields)
        self.session.commit()
        return updated_user

    
    def delete(self, user_id: int) -> None:
        deleted = self.repo.delete(user_id)
        if not deleted:
            raise ValueError("User not found")
        self.session.commit()