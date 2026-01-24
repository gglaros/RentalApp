from sqlalchemy import select
from sqlalchemy.orm import joinedload
from termcolor import colored
from app.database.models.users import User
from app.database.models.property import Property
from app.database.models.tenantApplication import TenantApplication
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from app.api.errors import translate_integrity_error


class TenantRepository:
    def __init__(self, session):
        self.session = session
        
        
        
    def create(self, TenantApplication): 
        try:
            self.session.add(TenantApplication)
            self.session.flush()  
        except IntegrityError as e:
           raise translate_integrity_error(e)
        self.session.commit()   
        return TenantApplication


    
    def list_tenants(self, limit=50, offset=0) -> list[User]:
        stmt = select(User).where(User.role == 'TENANT').limit(limit).offset(offset)
        return list(self.session.execute(stmt).scalars())
    
    
    def all_tenant_apps(self,limit=50,offset=0) ->list[TenantApplication]:
        stmt = select(TenantApplication).limit(limit).offset(offset)
        return list(self.session.execute(stmt).scalars())
    
    
    
    def update_status(self, tenant_app: TenantApplication, status: str) -> TenantApplication | None:
        tenant_app.status = status
        self.session.flush()
        return tenant_app
    
    
    def get_tenant_app_by_id(self, id: int) -> TenantApplication | None:
        stmt = select(TenantApplication).where(
            TenantApplication.id == id
        )
        result = self.session.execute(stmt)
        return result.scalars().first()
        
    
    def get_tenant_application_by_user_and_property(self, user_id: int, prop_id: int):
        stmt = select(TenantApplication).where(
        TenantApplication.tenant_id == user_id,
        TenantApplication.property_id == prop_id
    )
        return self.session.execute(stmt).scalar_one_or_none()
    
    
    def get_all_apps(self, owner_id: int, limit=50, offset=0) -> list[TenantApplication]:
     stmt = (
        select(TenantApplication)
        .join(Property)
        .where(Property.owner_id == owner_id)
        .limit(limit)
        .offset(offset)
    )
     print(colored (stmt,"red"))
     
     return list(self.session.execute(stmt).scalars())
