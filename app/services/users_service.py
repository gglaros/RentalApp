from werkzeug.security import generate_password_hash
from app.models.users import User, Role
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import  ConflictError, BadRequestError,NotFoundError
from app.repositories.properties_repository import PropertiesRepository


class UsersService:
    def __init__(self, session):
        self.repo = UsersRepository(session)
        self.session = session
        self.props = PropertiesRepository(session)


    def register(self, *, email: str, password: str, role: str, first_name=None, last_name=None, phone=None) -> User:
        
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            role = Role[role.upper()],
            first_name=first_name,
            last_name=last_name,
            phone=phone,
        )
        
        self.repo.create(user)
        self.session.commit()
        return user

    def get(self, user_id: int) -> User | None:
        user = self.repo.get(user_id)
        if not user:
            raise NotFoundError(f"user with id = {user_id} not found")
        return user

    def list(self, limit=50, offset=0):
        return self.repo.list(limit=limit, offset=offset)



    def update(self, user_id: int, **fields) -> User:
        user = self.repo.get(user_id)
        if not user:
            raise NotFoundError(f"Owner not found")

       
        protected = {"id", "password_hash", "created_at", "updated_at"}
        for k in list(fields.keys()):
         if k in protected or fields[k] is None:
            fields.pop(k, None)

        updated_user = self.repo.update(user_id, **fields)
        self.session.commit()
        return updated_user
    

    
   
    def force_delete_owner(self, owner_id: int) -> dict:
        user = self.repo.get(owner_id)
        if not user:
            raise NotFoundError(f"User {owner_id} not found")

       
        if user.role.name != "OWNER":
            self.repo.delete(user)
            return {"message": f"User {owner_id} deleted"}

       
        props_deleted = self.props.delete_by_owner(owner_id)

        self.repo.delete(user)

        return {
            "message": f"Owner {owner_id} deleted",
            "deleted": {"properties": props_deleted}
        }