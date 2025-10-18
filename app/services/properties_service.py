from app.models.property import Property
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import NotFoundError,BadRequestError
from app.repositories.properties_repository import PropertiesRepository

class PropertiesService:
    def __init__(self, session):
        self.repo = PropertiesRepository(session)
        self.users = UsersRepository(session)
        self.session = session

    def create(self, **data) -> Property:
      
        owner = self.users.get(data["owner_id"])
        if not owner:
            raise NotFoundError(f"Owner {data['owner_id']} not found")
        
       
        prop = Property(**data)
        self.repo.create(prop)
        self.session.commit()
        return prop
    
    def get(self, prop_id: int):
        prop = self.repo.get(prop_id)
        if not prop:
            raise NotFoundError(f"Property {prop_id} not found")
        return prop


    def list(self, owner_id: int | None = None, limit=50, offset=0):
        return self.repo.list(owner_id=owner_id, limit=limit, offset=offset)
