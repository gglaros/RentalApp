from sqlalchemy import select
from app.database.models.property import Property
from app.database.models.users import User, Role
from app.database.models.ownerApplication import OwnerApplication
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from app.api.errors import translate_integrity_error


class OwnerApplicationRepository:
    def __init__(self, session):
        self.session = session

    def create(self, owner_application): 
        try:
            self.session.add(owner_application)
            self.session.flush()  
        except IntegrityError as e:
           raise translate_integrity_error(e)
        self.session.commit()   
        return owner_application
    
    
    
    def list_owner_applications(self, limit=50, offset=0):
        stmt = select(OwnerApplication).limit(limit).offset(offset)
        result = self.session.execute(stmt)
        return result.scalars().all()
    
    
    def get_app_by_owner_and_property(self, owner_id: int, property_id: int) -> OwnerApplication | None:
        stmt = select(OwnerApplication).where(
            OwnerApplication.owner_id == owner_id,
            OwnerApplication.property_id == property_id
        )
        result = self.session.execute(stmt)
        return result.scalars().first()