from app.repositories.users_repository import UsersRepository
from app.common.exceptions import NotFoundError, ConflictError


class UserValidation:
    def __init__(self, session):
        self.users = UsersRepository(session)
        self.session = session

    def check_email(self, email: str) -> None:
        existing_user = self.users.get_by_email(email)
        if existing_user:
            raise ConflictError(f"Email {email} is already in use from validation.")


    def _check_user(self,user_id:int) -> None:
     user=self.users.get(user_id)
     if not user:
        raise NotFoundError("Owner not found")
