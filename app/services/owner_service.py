from werkzeug.security import generate_password_hash
from app.database.models.users import User, Role
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import  ConflictError, BadRequestError,NotFoundError
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.owner_repository import OwnerRepository
from app.validation.user_validation import UserValidation
from app.auth.token_utils import create_access_token
from app.database.db.session import get_session
from app.api.schemas.users import UserOutSchema

class OwnerService:
    def __init__(self):
        self.session = get_session() 
        self.users = UsersRepository(get_session())
        self.props = PropertiesRepository(get_session())
        self.owners = OwnerRepository(get_session())
        
        
        
    def list_owners(self, limit=50, offset=0):
     return self.owners.list_owners(limit=limit, offset=offset)
 

#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
 
 
    def get_owner(self,  userAuth) -> User | None:
        user=self.users.get(userAuth.id)
        
        if not user:
         raise NotFoundError(f"user not found in service")
     
        if user.role.value != "OWNER":
            raise BadRequestError(f"user is not an owner in owner serivce")
     
        return user
    
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    


    def delete_owner(self, owner_id:int,userAuth ) -> dict:
    
     owner=self.users.get(owner_id)
     if not owner:
        raise NotFoundError(f"user not found in service")
    
     if owner.id != userAuth.id 
        raise BadRequestError(f"Access denied to delete user data")
    
     self.users.delete(owner)
     return {"user_deleted": True, "user_role": owner.role.value, "user_id": owner.id}
