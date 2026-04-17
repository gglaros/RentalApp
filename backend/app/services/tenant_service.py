from flask import request
from termcolor import colored
from app.database.models.users import User, Role
from app.database.db.session import session_scope
from app.database.models.ownerApplication import OwnerApplication
from app.database.models.tenantApplication import TenantApplication
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import  ConflictError, BadRequestError,NotFoundError, UnauthorizedError
from app.repositories.owner_application_repository import OwnerApplicationRepository
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.revoked_tokens_repository import RevokedTokensRepository
from app.repositories.owner_repository import OwnerRepository
from app.repositories.tenant_application_repository import TenantRepository
from app.auth.token import decode_token
from app.database.db.session import get_session
from app.api.schemas.users import UserOutSchema



class TenantService:
    def __init__(self):
        self.session = get_session() 
        self.users = UsersRepository(get_session())
        self.props = PropertiesRepository(get_session())
        self.owners = OwnerRepository(get_session())
        self.owner_apps = OwnerApplicationRepository(get_session())
        self.tenants = TenantRepository(get_session())
        
    
    def list_tenants(self, limit=50, offset=0):
     return self.tenants.list_tenants(limit, offset)
 
 
 
    def get_my_tenant_applications(self, userAuth):
        user=self.users.get(userAuth.id)
        print(colored("i am in get_my_tenant_application", 'yellow'))
        
        if not user:
         raise NotFoundError(f"user not found in service")
     
        if user.role.value != "TENANT":
            raise BadRequestError(f"user is not a tenant in tenant serivce")
        
        tenant_apps = self.tenants.get_tenant_app_by_id(user.id)
        print(colored(tenant_apps, 'yellow'))
        return tenant_apps
        
 
 
    def create_tenant_application(self, userAuth,prop_id,**payload)->TenantApplication:
     
     user=self.users.get(userAuth.id)
     
     if not user:
         raise NotFoundError(f"user not found in tenant service")
     
     if user.role.value != "TENANT":
         raise BadRequestError(f"user is not a tenant in tenant service")
     
     property=self.props.get(prop_id)
     apps=self.tenants.all_tenant_apps()
     print(colored("i am in create_tenant_application", 'green'))
     print(colored(apps,  'green'))
     
     if not property:
         raise NotFoundError(f"property with id {prop_id} not found")
     
     existing_application=self.tenants.get_tenant_application_by_user_and_property(user.id, prop_id)
     
     if existing_application:
         print(colored(existing_application.status,'yellow'))
     
     if existing_application:
         raise ConflictError(f"Tenant application already exists for user id {user.id} and property id {prop_id}")
     
     
     
     
     
     
     payload['property_id'] = prop_id
     payload['tenant_id'] = user.id

     TenantApp = TenantApplication(**payload)
     print(colored("i am in create_tenant_application and tenantApp", 'green'))
     print(colored(TenantApp,  'green'))
     self.tenants.create(TenantApp) 
     print(colored(payload,  'green'))
     print(colored(TenantApp.property.id,  'blue'))
        
     return TenantApp
  