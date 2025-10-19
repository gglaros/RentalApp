from app.models.property import Property
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import NotFoundError,BadRequestError,ConflictError
from app.repositories.properties_repository import PropertiesRepository
from app.models.users import Role

class PropertiesService:
    def __init__(self, session):
        self.repo = PropertiesRepository(session)
        self.users = UsersRepository(session)
        self.session = session

    def create(self, **data) -> Property:
        owner = self.users.get(data["owner_id"])
        existing = self.repo.find_by_address_and_unit(data["address"], data["unit_number"])
     
        if existing:
             if existing.owner_id != data["owner_id"]:
              raise ConflictError("This property already exists and is owned by another user.")
             else:
              raise ConflictError("You already own this property.")

        if not owner:
            raise NotFoundError(f"Owner {data['owner_id']} not found")
        if owner.role != Role.OWNER:
           raise BadRequestError(f"User {data['owner_id']} is not an owner")

        prop = Property(**data)
        self.repo.create(prop)
        return prop
    
    def get(self, prop_id: int):
        prop = self.repo.get(prop_id)
        if not prop:
            raise NotFoundError(f"Property {prop_id} not found")
        return prop


    def list(self, owner_id: int | None = None, limit=50, offset=0):
        return self.repo.list(owner_id=owner_id, limit=limit, offset=offset)



    def update(self, prop_id: int, **fields) -> Property:
        prop = self.repo.get(prop_id)
        if not prop:
            raise NotFoundError(f"Property {prop_id} not found")

        protected = {"id", "owner_id", "updated_at"}
        for k in list(fields.keys()):
         if k in protected or fields[k] is None:
            fields.pop(k, None)

        updated_prop = self.repo.update(prop_id, **fields)
        self.session.commit()
        return updated_prop


    def delete(self, prop_id: int) -> None:
        prop = self.repo.get(prop_id)
        if not prop:
            raise NotFoundError(f"Property {prop_id} not found")
        self.repo.delete(prop)
        self.session.commit()