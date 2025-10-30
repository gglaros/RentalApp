from werkzeug.security import generate_password_hash
from app.database.models.users import User, Role
from app.database.models.ownerApplication import OwnerApplication
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import  ConflictError, BadRequestError,NotFoundError
from app.repositories.owner_application_repository import OwnerApplicationRepository
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.owner_repository import OwnerRepository
from app.validation.user_validation import UserValidation
# from app.auth.token_utils import create_access_token
from app.database.db.session import get_session
from app.api.schemas.users import UserOutSchema

class OwnerService:
    def __init__(self):
        self.session = get_session() 
        self.users = UsersRepository(get_session())
        self.props = PropertiesRepository(get_session())
        self.owners = OwnerRepository(get_session())
        self.owner_apps = OwnerApplicationRepository(get_session())
        
        
        
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
    
     if owner.id != userAuth.id :
        raise BadRequestError(f"Access denied to delete user data")
    
     self.users.delete(owner)
     return {"user_deleted": True, "user_role": owner.role.value, "user_id": owner.id}


#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    


    def create_owner_application(self, userAuth, prop_id, **payload) -> OwnerApplication:
        user = self.users.get(userAuth.id)
        
        if not user:
            raise NotFoundError("user not found in service")
        if user.role.value != "OWNER":
            raise BadRequestError("user is not an owner")
        
        prop = self.props.get(prop_id)
        if not prop:
         raise NotFoundError("property not found in service")

        ownerProp = self.props.get_prop_by_owner_id(user.id, prop_id)
        if not ownerProp:
            raise BadRequestError("property does not belong to this owner")
        
        app=self.owner_apps.get_app_by_owner_and_property(user.id, prop_id)
        
        if app:
            raise ConflictError("Owner application already exists for this property and owner and is ",app.status.value)
           
        payload['property_id'] = prop_id
        payload['owner_id'] = user.id

        
        OwnerApp = OwnerApplication(**payload)
        self.owner_apps.create(OwnerApp) 
        return OwnerApp






#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

    
    
    def list_owner_applications(self, limit=50, offset=0):
     return self.owner_apps.list_owner_applications(limit=limit, offset=offset)