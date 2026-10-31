from app.database.models.users import Role
from app.database.models.tenantApplication import TenantApplication
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import ConflictError, BadRequestError, NotFoundError, ForbiddenError
from app.repositories.owner_application_repository import OwnerApplicationRepository
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.owner_repository import OwnerRepository
from app.repositories.tenant_application_repository import TenantRepository
from app.database.db.session import get_session


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

        if not user:
         raise NotFoundError("User not found")

        if user.role.value != "TENANT":
            raise BadRequestError("user is not a tenant")

        return self.tenants.list_by_tenant(user.id)


    def create_tenant_application(self, userAuth,prop_id,**payload)->TenantApplication:

     user=self.users.get(userAuth.id)

     if not user:
         raise NotFoundError("User not found")

     if user.role.value != "TENANT":
         raise BadRequestError("user is not a tenant")

     property=self.props.get(prop_id)

     if not property or property.status != "APPROVED":
         raise NotFoundError(f"property with id {prop_id} not found")

     existing_application=self.tenants.get_tenant_application_by_user_and_property(user.id, prop_id)


     if existing_application:
         raise ConflictError(f"Tenant application already exists for user id {user.id} and property id {prop_id}")


     payload['property_id'] = prop_id
     payload['tenant_id'] = user.id

     TenantApp = TenantApplication(**payload)
     self.tenants.create(TenantApp)

     return TenantApp


    def cancel_tenant_application(self, app_id: int, userAuth) -> dict:

     user = self.users.get(userAuth.id)
     if not user:
         raise NotFoundError("User not found")

     tenant_app = self.tenants.get_tenant_app_by_id(app_id)
     if not tenant_app:
         raise NotFoundError("tenant application not found")

     if tenant_app.tenant_id != user.id and user.role != Role.ADMIN:
         raise ForbiddenError("This is not your application")

     self.tenants.delete(tenant_app)
     return {"tenant_application_deleted": True, "application_id": app_id}
