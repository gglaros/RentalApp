from flask import request
from termcolor import colored
from app.database.models.users import User, Role
from app.database.db.session import session_scope
from app.database.models.ownerApplication import OwnerApplication
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import  ConflictError, BadRequestError,NotFoundError, UnauthorizedError
from app.repositories.owner_application_repository import OwnerApplicationRepository
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.revoked_tokens_repository import RevokedTokensRepository
from app.repositories.owner_repository import OwnerRepository
from app.auth.token import decode_token
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
        
        token = request.headers.get("Authorization", "")
        
        token=token.split(" ", 1)[1].strip()
        print(colored (token , 'green'))
        
        with session_scope() as s:
         revoked_repo = RevokedTokensRepository(s)
         if revoked_repo.is_revoked(token):
             raise UnauthorizedError("Token has been revoked (logout detected malaka).") 
         
        if not user:
         raise NotFoundError(f"user not found in service")
     
        if user.role.value != "OWNER":
            raise BadRequestError(f"user is not an owner in owner serivce")
     
        return user
    
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    


    def delete_owner(self, owner_id:int,userAuth ) -> dict:
    
     user=self.users.get(owner_id)
     if not user:
        raise NotFoundError(f"user not found in service")
    
     if user.id != userAuth.id and user.role.value != "ADMIN":
        raise BadRequestError(f"Access denied to delete user data")
    
     self.users.delete(user)
     return {"user_deleted": True, "user_role": user.role.value, "user_id": user.id}


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
 
 #//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

    def update_owner_application_status(self, app_id: int, **payload) -> OwnerApplication:
        owner_app = self.owner_apps.get_app_by_id(app_id)
        print(colored(owner_app,  'blue'))
        print(colored(payload['status'],  'blue'))
        
        if not owner_app:
            raise NotFoundError("Owner application not found")
        
        self.owner_apps.update_status(owner_app,payload['status'])
        self.session.commit()
        return owner_app
    
    
    
    def delete_owner_application(self, app_id:int,userAuth ) -> dict:
    
     user=self.users.get(userAuth.id)
     if not user:
        raise NotFoundError(f"user not found in service")
    
     owner_app = self.owner_apps.get_app_by_id(app_id)
     if not owner_app:
         raise NotFoundError("Owner application not found")
     
     if owner_app.owner_id != user.id and user.role.value != "ADMIN":
        raise BadRequestError(f"Access denied to delete owner application")
    
     self.owner_apps.delete(owner_app)
     return {"owner_application_deleted": True, "owner_id": owner_app.owner_id, "application_id": owner_app.id}