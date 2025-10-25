from app.database.models.property import Property
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import NotFoundError,BadRequestError,ConflictError
from app.repositories.properties_repository import PropertiesRepository
from app.validation.property_validation import PropertyValidation
from app.database.models.users import Role
from app.database.db.session import get_session

class PropertiesService:
    def __init__(self):
        self.session = get_session() 
        self.repo = PropertiesRepository(get_session() )
        self.users = UsersRepository(get_session())

    def create(self, **data) -> Property:
        print("\033[91mCreating property with data:\033[0m", self.users.get(data["owner_id"]))
        
        owner=self.users.get(data["owner_id"])
     
        if not owner:
         raise NotFoundError(f"Owner not found")
        
        existing = self.repo.find_by_address_and_unit(data["address"], data["unit_number"])
        
        if existing:
            if existing.owner_id != owner.id:
                raise ConflictError("This property already exists and is owned by another user.")
            else:
                raise ConflictError("You already own this property.")
            
        prop = Property(**data)
        self.repo.create(prop)
        return prop
    

    def get(self, prop_id: int):
        prop = self.repo.get(prop_id)
        if not prop:
            raise NotFoundError(f"Property {prop_id} not found in validation")    
        
        prop = self.repo.get(prop_id)
        return prop


    def list_all(self,) -> list[Property]:
        return self.repo.list_all()
    
    
    
    def list_by_owner(self, owner_id: int) -> list[Property]:
        PropertyValidation._check_owner(self, {"owner_id": owner_id})
        return self.repo.list_by_owner(owner_id)

    

    def update(self, prop_id: int, **fields) -> Property:
    
        PropertyValidation.check_property_exists(self,prop_id)
    
        protected = {"id", "owner_id", "updated_at"}
        for k in list(fields.keys()):
         if k in protected or fields[k] is None:
            fields.pop(k, None)

        updated_prop = self.repo.update(prop_id, **fields)
        return updated_prop


    def delete(self, prop_id: int, user) -> None:
        # PropertyValidation.check_property_exists(self,prop_id)
        
        prop = self.repo.get(prop_id)
        if not prop:
         raise NotFoundError(f"Property {prop_id} not found")
    
        if prop.owner_id != user.id:
         raise BadRequestError("You do not have permission to delete this property")

        self.repo.delete(prop)
        return {"message": "Property deleted"}
        
        