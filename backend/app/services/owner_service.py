import logging
from app.database.models.users import Role
from app.database.models.ownerApplication import OwnerApplication
from app.database.models.tenantApplication import TenantApplication
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import ConflictError, BadRequestError, NotFoundError, ForbiddenError
from app.repositories.owner_application_repository import OwnerApplicationRepository
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.owner_repository import OwnerRepository
from app.repositories.tenant_application_repository import TenantRepository
from app.database.db.session import get_session

logger = logging.getLogger(__name__)

class OwnerService:
    def __init__(self):
        self.session = get_session()
        self.users = UsersRepository(get_session())
        self.props = PropertiesRepository(get_session())
        self.owners = OwnerRepository(get_session())
        self.owner_apps = OwnerApplicationRepository(get_session())
        self.tenant_apps = TenantRepository(get_session())


    def list_owners(self, limit=50, offset=0):
     return self.owners.list_owners(limit=limit, offset=offset)


    def delete_owner(self, owner_id:int,userAuth ) -> dict:

     user=self.users.get(owner_id)
     if not user:
        raise NotFoundError("User not found")

     if user.id != userAuth.id and userAuth.role != Role.ADMIN:
        raise ForbiddenError("You can only delete your own account")

     self.users.delete(user)
     logger.info("User %s deleted account %s", userAuth.id, user.id)
     return {"user_deleted": True, "user_role": user.role.value, "user_id": user.id}


    def create_owner_application(self, userAuth, prop_id, **payload) -> OwnerApplication:
        user = self.users.get(userAuth.id)

        if not user:
            raise NotFoundError("User not found")
        if user.role.value != "OWNER":
            raise BadRequestError("user is not an owner")

        prop = self.props.get(prop_id)
        if not prop:
         raise NotFoundError("property not found")

        ownerProp = self.props.get_prop_by_owner_id(user.id, prop_id)
        if not ownerProp:
            raise BadRequestError("property does not belong to this owner")

        app=self.owner_apps.get_app_by_owner_and_property(user.id, prop_id)

        if app:
            raise ConflictError(f"You have already applied for this property (status: {app.status.value})")

        payload['property_id'] = prop_id
        payload['owner_id'] = user.id

        OwnerApp = OwnerApplication(**payload)
        self.owner_apps.create(OwnerApp)

        return OwnerApp


    def list_owner_applications(self, limit=50, offset=0):
     return self.owner_apps.list_owner_applications(limit=limit, offset=offset)


    def update_owner_application_status(self, app_id: int, **payload) -> OwnerApplication:
        owner_app = self.owner_apps.get_app_by_id(app_id)
        if not owner_app:
            raise NotFoundError("Owner application not found")

        self.owner_apps.update_status(owner_app, payload['status'])
        logger.info("Owner application %s -> %s", app_id, payload['status'])
        return owner_app


    def update_tenant_application_status(self, app_id: int, userAuth=None, **payload) -> TenantApplication:
        tenant_app= self.tenant_apps.get_tenant_app_by_id(app_id)

        if not tenant_app:
            raise NotFoundError("tenant application not found")

        if userAuth is not None:
            user = self.users.get(userAuth.id)
            if not user:
                raise NotFoundError("User not found")
            if tenant_app.property.owner_id != user.id and user.role != Role.ADMIN:
                raise ForbiddenError("This request is not for one of your properties")

        self.tenant_apps.update_status(tenant_app, payload['status'])
        logger.info("Tenant application %s -> %s", app_id, payload['status'])
        return tenant_app


    def update_property_status(self,app:OwnerApplication):
         self.props.update_status(app.property_id,app.status)
         return app.status


    def delete_owner_application(self, app_id:int,userAuth ) -> dict:

     user=self.users.get(userAuth.id)
     if not user:
        raise NotFoundError("User not found")

     owner_app = self.owner_apps.get_app_by_id(app_id)
     if not owner_app:
         raise NotFoundError("Owner application not found")

     if owner_app.owner_id != user.id and user.role != Role.ADMIN:
        raise ForbiddenError("This is not your application")

     self.owner_apps.delete(owner_app)
     return {"owner_application_deleted": True, "owner_id": owner_app.owner_id, "application_id": owner_app.id}


    def get_all_requests(self, userAuth) -> dict:
     user = self.users.get(userAuth.id)
     if not user:
        raise NotFoundError(f"User with id={userAuth.id} not found")

     if user.role.value != "OWNER" and user.role.value !="ADMIN":
        raise BadRequestError("Access denied to see owner application")

     apps = self.tenant_apps.get_all_apps(owner_id=user.id)


     return apps


    def delete_request(self, request_id:int,userAuth ) -> dict:

     user=self.users.get(userAuth.id)
     if not user:
        raise NotFoundError("User not found")
     tenant_app = self.tenant_apps.get_tenant_app_by_id(request_id)
     if not tenant_app:
         raise NotFoundError("Request not found")
     if tenant_app.property.owner_id != user.id and user.role != Role.ADMIN:
        raise ForbiddenError("This request is not for one of your properties")

     self.tenant_apps.delete(tenant_app)
     return {"request_deleted": True, "application_id": request_id}
