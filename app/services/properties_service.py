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

    def create(self, userAuth,**data) -> Property:
       
        user=self.users.get(userAuth.id)
       
        if not user: 
         raise NotFoundError(f"Owner not found")
        
        if user.role != Role.OWNER:
         raise BadRequestError("Only users with OWNER role can create properties")
     
        existing = self.repo.find_by_address_and_unit(data["address"], data["unit_number"])
        
        if existing:
            if existing.owner_id != user.id:
                raise ConflictError("This property already exists and is owned by another user.service")
            else:
                raise ConflictError("You already own this property.service")
            
        prop = Property(**data)
        self.repo.create(prop)
        return prop
    
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    def get(self, prop_id: int):
        prop = self.repo.get(prop_id)
        if not prop:
            raise NotFoundError(f"Property {prop_id} not found in validation")    
        
        prop = self.repo.get(prop_id)
        return prop

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    def list_all(self,) -> list[Property]:
        return self.repo.list_all()
    
    
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    def list_by_owner(self, owner_id: int,userAuth) -> list[Property]:
        
        user=self.users.get(userAuth.id)
     
        if not user:
         raise NotFoundError(f"user not found in property service")
        if user.role != Role.OWNER:
         raise BadRequestError(f"User {user.id} is not an owner")
       
        if owner_id != userAuth.id or userAuth.role != Role.OWNER:
         raise BadRequestError("You do not have permission to view these properties")
     
        return self.repo.list_by_owner(owner_id)

    
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    

    def update(self, prop_id: int, user,**fields) -> Property:
    
        PropertyValidation.check_property_exists(self,prop_id)
        prop = self.repo.get(prop_id)
        if prop.owner_id != user.id:
         raise BadRequestError("You do not have permission to update this property")
        
        protected = {"id", "owner_id", "updated_at"}
        for k in list(fields.keys()):
         if k in protected or fields[k] is None:
            fields.pop(k, None)

        updated_prop = self.repo.update(prop_id, **fields)
        return updated_prop


#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    def delete(self, prop_id: int, user) -> None:
        prop = self.repo.get(prop_id)
        if not prop:
         raise NotFoundError(f"Property {prop_id} not found")
         
        if prop.owner_id != user.id:
         raise BadRequestError("You do not have permission to delete this property")
        
        self.repo.delete(prop)
        return {"message": "Property deleted"}
        
        