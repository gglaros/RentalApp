from werkzeug.security import generate_password_hash
from app.models.users import User, Role
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import  ConflictError, BadRequestError,NotFoundError


class UsersService:
    def __init__(self, session):
        self.repo = UsersRepository(session)
        self.session = session


    def register(self, *, email: str, password: str, role: str, first_name=None, last_name=None, phone=None) -> User:
        # business checks χωρίς writes:
        if self.repo.get_by_email(email):
            raise ConflictError("Email already in use")
        try:
            role_enum = Role[role.upper()]
        except KeyError:
            raise BadRequestError("Invalid role")

        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            role=role_enum,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
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
            raise NotFoundError(f"Owner not found")

       
        protected = {"id", "email", "password_hash", "created_at", "updated_at"}
        for k in list(fields.keys()):
         if k in protected or fields[k] is None:
            fields.pop(k, None)

        updated_user = self.repo.update(user_id, **fields)
        self.session.commit()
        return updated_user
    
    
    

    
    def delete(self, user_id: int) -> None:
        deleted = self.repo.delete(user_id)
        if not deleted:
            raise ValueError("User not found")
        self.session.commit()