from sqlalchemy import select
from app.models.property import Property

class PropertiesRepository:
    def __init__(self, session):
        self.session = session

    def create(self, prop: Property) -> Property:
        self.session.add(prop)
        self.session.flush()
        return prop

    def get(self, prop_id: int) -> Property | None:
        return self.session.get(Property, prop_id)

    def list(self, owner_id: int | None = None, limit=50, offset=0) -> list[Property]:
        stmt = select(Property)
        if owner_id is not None:
            stmt = stmt.where(Property.owner_id == owner_id)
        stmt = stmt.limit(limit).offset(offset)
        return list(self.session.execute(stmt).scalars())
