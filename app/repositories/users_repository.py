from sqlalchemy import select
from app.database.models.users import User
from app.database.models.property import Property
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from app.api.errors import translate_integrity_error

class UsersRepository:
    def __init__(self, session):
        self.session = session
       

    def create(self, user: User) -> User:
        try:
            self.session.add(user)
            self.session.flush()  
        except IntegrityError as e:
            raise translate_integrity_error(e)
        self.session.commit()   
        return user
       
       
       
       

    def get(self, user_id: int) -> User | None:
        return self.session.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        return self.session.execute(stmt).scalar_one_or_none()

    def list(self, limit=50, offset=0) -> list[User]:
        stmt = select(User).limit(limit).offset(offset)
        return list(self.session.execute(stmt).scalars())


    def update(self, user_id: int, **fields) -> User | None:
        user = self.get(user_id)
        
        for key, value in fields.items():
            setattr(user, key, value)
        self.session.flush()
        return user

   
 
    def delete_by_owner(self, owner_id: int) -> int:
        stmt = delete(Property).where(Property.owner_id == owner_id)
        res = self.session.execute(stmt)
        return getattr(res, "rowcount", 0)
       
   
   
    
    def delete(self, user: User) -> None:
     self.session.delete(user)
     self.session.flush()
