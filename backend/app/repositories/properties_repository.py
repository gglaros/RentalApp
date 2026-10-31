from sqlalchemy import select, or_
from app.database.models.property import Property
from sqlalchemy.exc import IntegrityError
from app.api.errors import translate_integrity_error

class PropertiesRepository:
    def __init__(self, session):
        self.session = session

    def create(self, prop):
        try:
            self.session.add(prop)
            self.session.flush()
        except IntegrityError as e:
           raise translate_integrity_error(e)
        return prop


    def get(self, prop_id: int) -> Property | None:
        return self.session.get(Property, prop_id)


    def find_by_address_and_unit(self, address: str, unit_number: str) -> Property | None:
     stmt = select(Property).where( Property.address == address,Property.unit_number == unit_number )
     return self.session.scalar(stmt)


    def list_approved(self, limit=50, offset=0) -> list[Property]:
     stmt = select(Property).where( Property.status == "APPROVED" )
     return self.session.scalars(stmt).all()


    def search_approved(self, q=None, min_price=None, max_price=None,
                        min_sqft=None, max_sqft=None, sort="newest",
                        limit=50, offset=0) -> list[Property]:
     stmt = select(Property).where(Property.status == "APPROVED")

     if q:
        like = f"%{q.strip()}%"
        stmt = stmt.where(or_(Property.address.ilike(like), Property.description.ilike(like)))
     if min_price is not None:
        stmt = stmt.where(Property.price >= min_price)
     if max_price is not None:
        stmt = stmt.where(Property.price <= max_price)
     if min_sqft is not None:
        stmt = stmt.where(Property.square_feet >= min_sqft)
     if max_sqft is not None:
        stmt = stmt.where(Property.square_feet <= max_sqft)

     order = {
        "price_asc": Property.price.asc(),
        "price_desc": Property.price.desc(),
        "sqft_desc": Property.square_feet.desc(),
        "newest": Property.id.desc(),
     }.get(sort, Property.id.desc())

     stmt = stmt.order_by(order).limit(limit).offset(offset)
     return self.session.scalars(stmt).all()


    def list_all(self, limit=50, offset=0) -> list[Property]:
     stmt = (select(Property).order_by(Property.id.desc()).limit(limit).offset(offset))
     return self.session.scalars(stmt).all()


    def get_prop_by_owner_id(self, owner_id: int,prop_id:int) -> Property | None:
     stmt = select(Property).where( Property.owner_id == owner_id,Property.id==prop_id )
     return self.session.scalar(stmt)


    def list_by_owner(self, owner_id: int, limit=50, offset=0) -> list[Property]:
     stmt = (select(Property).where(Property.owner_id == owner_id).order_by(Property.id.desc()).limit(limit).offset(offset))
     return self.session.scalars(stmt).all()

    def update_status(self,prop_id:int,status ):
        prop=self.get(prop_id)
        prop.status = getattr(status, "value", status)
        self.session.flush()
        return prop

    def update(self, prop_id: int, **fields) -> Property | None:
        prop = self.get(prop_id)

        for key, value in fields.items():
            setattr(prop, key, value)
        self.session.flush()
        return prop


    def delete(self, prop: Property) -> None:
       self.session.delete(prop)
       self.session.flush()
