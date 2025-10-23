from werkzeug.security import generate_password_hash
from app.models.users import User, Role
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import  ConflictError, BadRequestError,NotFoundError
from app.repositories.properties_repository import PropertiesRepository
from app.validation.user_validation import UserValidation

class UsersService:
    def __init__(self, session):
        self.repo = UsersRepository(session)
        self.session = session
        self.props = PropertiesRepository(session)


    def register(self, *, email: str, password: str, role: str, first_name=None, last_name=None, phone=None) -> User:
        
        UserValidation.check_email(self, email)
        
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            role = Role[role.upper()],
            first_name=first_name,
            last_name=last_name,
            phone=phone,)
        self.repo.create(user)
        return user


    def get(self, user_id: int) -> User | None:
        UserValidation._check_user(self,user_id)
        user = self.repo.get(user_id)
        return user

    def list(self, limit=50, offset=0):
        return self.repo.list(limit=limit, offset=offset)



    def update(self, user_id: int, **fields) -> User:
        user = self.repo.get(user_id)
        if not user:
            raise NotFoundError(f"Owner not found")

       
        protected = {"id", "role","password_hash", "created_at", "updated_at"}
        for k in list(fields.keys()):
         if k in protected or fields[k] is None:
            fields.pop(k, None)

        updated_user = self.repo.update(user_id, **fields)
        self.session.commit()
        return updated_user
    
   
    def force_delete_user(self, user_id: int) -> dict:
     UserValidation._check_user(self,user_id)
     user = self.repo.get(user_id)
    
     if user.role.name != "OWNER":
        self.repo.delete(user)
        return {"user_deleted": True}

     props_deleted = self.props.delete_by_owner(user_id)
     self.repo.delete(user)
     return {"user_deleted": True, "properties_deleted": props_deleted}
