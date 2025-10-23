from app.models.property import Property
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import NotFoundError,BadRequestError,ConflictError
from app.repositories.properties_repository import PropertiesRepository
from app.validation.property_validation import PropertyValidation
from app.models.users import Role
from app.db.session import get_session

class PropertiesService:
    def __init__(self):
        self.session = get_session() 
        self.repo = PropertiesRepository(get_session() )
        self.users = UsersRepository(get_session())

    def create(self, **data) -> Property:
        print("\033[91mCreating property with data:\033[0m", self.users.get(data["owner_id"]))
        
        PropertyValidation._check_owner(self,data)
        PropertyValidation.check_property_already_exists(self,data)
            
        prop = Property(**data)
        self.repo.create(prop)
        return prop
    

    def get(self, prop_id: int):
        PropertyValidation.check_property_exists(self,prop_id)
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


    def delete(self, prop_id: int) -> None:
        PropertyValidation.check_property_exists(self,prop_id)
        
        prop = self.repo.get(prop_id)
        self.repo.delete(prop)
        return ({"message": "Property deleted"})
        
        