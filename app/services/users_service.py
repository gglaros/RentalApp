from werkzeug.security import generate_password_hash
from app.database.models.users import User, Role
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import  ConflictError, BadRequestError,NotFoundError
from app.repositories.properties_repository import PropertiesRepository
from app.validation.user_validation import UserValidation
from app.auth.token_utils import create_access_token
from app.database.db.session import get_session
from app.api.schemas.users import UserOutSchema

class UsersService:
    def __init__(self):
        self.session = get_session() 
        self.users = UsersRepository(get_session())
        self.props = PropertiesRepository(get_session())


    def register(self, *, email: str, password: str, role: str, first_name=None, last_name=None, phone=None) -> User:
        print("\033[91mRegistering user with email:\033[0m")
        
        existing_user = self.users.get_by_email(email)
        if existing_user:
            raise ConflictError(f"Email {email} is already in use from validation.")
       
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            role = Role[role.upper()],
            first_name=first_name,
            last_name=last_name,
            phone=phone,)
        
        self.users.create(user)
        token = create_access_token(user.id, user.role.name)
        
        return {
        "user": UserOutSchema().dump(user),
        "token": token,
    }, 201


    def get(self, user_id: int) -> User | None:
       
        user=self.users.get(user_id)
        if not user:
         raise NotFoundError(f"Owner not found in service")
       
        user = self.users.get(user_id)
        return user

    def list(self, limit=50, offset=0):
        return self.users.list(limit=limit, offset=offset)



    def update(self, user_id: int, **fields) -> User:
        user = self.users.get(user_id)
        if not user:
            raise NotFoundError(f"user not found")

       
        protected = {"id", "role","password_hash", "created_at", "updated_at"}
        for k in list(fields.keys()):
         if k in protected or fields[k] is None:
            fields.pop(k, None)

        updated_user = self.users.update(user_id, **fields)
        self.session.commit()
        return updated_user
    
   
    def force_delete_user(self, user_id: int) -> dict:
     UserValidation._check_user(self,user_id)
     
     
     user = self.users.get(user_id)
    
     if user.role.name != "OWNER":
        self.users.delete(user)
        return {"user_deleted": True}

     props_deleted = self.props.delete_by_owner(user_id)
     self.users.delete(user)
     return {"user_deleted": True, "properties_deleted": props_deleted}
