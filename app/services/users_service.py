from termcolor import colored
from werkzeug.security import generate_password_hash
from app.database.models.users import User, Role
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import  ConflictError, BadRequestError,NotFoundError
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.owner_repository import OwnerRepository
from app.repositories.owner_application_repository import OwnerApplicationRepository
from app.validation.user_validation import UserValidation
from sqlalchemy.inspection import inspect
import time
from app.database.db.session import get_session
from app.api.schemas.users import UserOutSchema

class UsersService:
    def __init__(self):
        self.session = get_session() 
        self.users = UsersRepository(get_session())
        self.props = PropertiesRepository(get_session())
        self.owner_apps = OwnerApplicationRepository(get_session())

    def sign_up(self, *, email: str, password: str, role: str, first_name=str, last_name=None, phone=None) -> User:
        
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            role = Role[role.upper()],
            first_name=first_name,
            last_name=last_name,
            phone=phone,)
        
        
        self.users.create(user)
        
        return { "user": UserOutSchema().dump(user)}, 201

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    def get(self,  userid) -> User | None:
    
        user=self.users.get(userid)      # user to be fetched
        if  not user:
         raise NotFoundError(f"user   not found in service")
        
        return user
        

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    def list(self, limit=50, offset=0):
        return self.users.list_all(limit=limit, offset=offset)

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    def update(self, userAuth, user_id: int, **fields) -> User:
        user = self.users.get(user_id)
        if not user:
            raise NotFoundError(f"user not found")

        if user.id != userAuth.id:
            raise BadRequestError(f"Access denied to update user data")
        
        protected = {"id", "role","password_hash", "created_at", "updated_at"}
        for k in list(fields.keys()):
         if k in protected or fields[k] is None:
            fields.pop(k, None)

        updated_user = self.users.update(user_id, **fields)
        self.session.commit()
        return updated_user
    
    
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    def force_delete_user(self, user_id: int) -> dict:
    
     user=self.users.get(user_id)
     if not user:
        raise NotFoundError(f"user not found in service")
    
     self.users.delete(user)
     return {"user_deleted": True, "user_role": user.role.value, "user_id": user.id}  

