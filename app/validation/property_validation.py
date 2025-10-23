from app.models.property import Property
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import NotFoundError,BadRequestError,ConflictError
from app.repositories.properties_repository import PropertiesRepository
from app.models.users import Role


class PropertyValidation:
    def __init__(self, session):
        self.repo = PropertiesRepository(session)
        self.users = UsersRepository(session)
        self.session = session
        
        
    def _check_owner(self,data:dict) -> None:
     
     owner=self.users.get(data["owner_id"])
     
     if not owner:
        raise NotFoundError(f"Owner not found")
     if owner.role != Role.OWNER:
        raise BadRequestError(f"User {owner.id} is not an owner")
    
    
    def check_property_already_exists(self,data) -> None:
        
        owner = self.users.get(data["owner_id"])
        existing = self.repo.find_by_address_and_unit(data["address"], data["unit_number"])
        
        if existing:
            if existing.owner_id != owner.id:
                raise ConflictError("This property already exists and is owned by another user.")
            else:
                raise ConflictError("You already own this property.")
   
    
    def check_property_exists(self,prop_id:int) -> None:
        prop = self.repo.get(prop_id)
        if not prop:
            raise NotFoundError(f"Property {prop_id} not found")    