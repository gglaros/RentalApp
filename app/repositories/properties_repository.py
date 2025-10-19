from sqlalchemy import select
from app.models.property import Property
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from app.api.errors import translate_integrity_error

class PropertiesRepository:
    def __init__(self, session):
        self.session = session

    def create(self, prop):
        self.session.add(prop)
        try:
            self.session.flush()  # να σκάσει εδώ το unique/FK πριν το commit
        except IntegrityError as e:
            print(f"IntegrityError in PropertiesRepository.create: {repr(e)}")
            raise translate_integrity_error(e)
           

        return prop

    def get(self, prop_id: int) -> Property | None:
        return self.session.get(Property, prop_id)
    
    
    
    def find_by_address_and_unit(self, address: str, unit_number: str) -> Property | None:
     stmt = select(Property).where(
        Property.address == address,
        Property.unit_number == unit_number
    )
     return self.session.scalar(stmt)


    def list(self, owner_id: int | None = None, limit=50, offset=0) -> list[Property]:
        stmt = select(Property)
        if owner_id is not None:
            stmt = stmt.where(Property.owner_id == owner_id)
        stmt = stmt.order_by(Property.id.desc()).limit(limit).offset(offset)
        return self.session.scalars(stmt).all()
    
    def update(self, prop_id: int, **fields) -> Property | None:
        prop = self.get(prop_id)
        
        for key, value in fields.items():
            setattr(prop, key, value)
        self.session.flush()
        return prop
    
    
    def delete(self, prop: Property) -> None:
       self.session.delete(prop)
       self.session.flush()
    
    
    def delete_by_owner(self, owner_id: int) -> int:
        stmt = delete(Property).where(Property.owner_id == owner_id)
        res = self.session.execute(stmt)
        return getattr(res, "rowcount", 0)
    
    
  