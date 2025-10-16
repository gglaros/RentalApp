from app.models.property import Property
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.users_repository import UsersRepository

class PropertiesService:
    def __init__(self, session):
        self.repo = PropertiesRepository(session)
        self.users = UsersRepository(session)
        self.session = session

    def create(self, **data) -> Property:
        # Βεβαίωση ότι ο owner υπάρχει και (προαιρετικά) ότι έχει ρόλο OWNER
        owner = self.users.get(data["owner_id"])
        if not owner:
            raise ValueError("Owner not found")

        prop = Property(**data)
        self.repo.create(prop)
        self.session.commit()
        return prop

    def get(self, prop_id: int) -> Property | None:
        return self.repo.get(prop_id)

    def list(self, owner_id: int | None = None, limit=50, offset=0):
        return self.repo.list(owner_id=owner_id, limit=limit, offset=offset)
