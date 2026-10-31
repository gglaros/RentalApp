import inspect
from functools import wraps

from flask import g, request

from app.auth.token import decode_token
from app.common.exceptions import ForbiddenError, UnauthorizedError
from app.database.db.session import get_session
from app.database.models.users import Role, User
from app.repositories.revoked_tokens_repository import RevokedTokensRepository
from app.repositories.users_repository import UsersRepository


def bearer_token() -> str:
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        raise UnauthorizedError("Missing or invalid Authorization header")
    token = header.split(" ", 1)[1].strip()
    if not token:
        raise UnauthorizedError("Missing or invalid Authorization header")
    return token


def _authenticate() -> User:
    token = bearer_token()
    session = get_session()

    if RevokedTokensRepository(session).is_revoked(token):
        raise UnauthorizedError("Token has been revoked")

    payload = decode_token(token)
    user = UsersRepository(session).get(payload.get("userId"))

    if not user or not user.is_active:
        raise UnauthorizedError("User no longer exists or is inactive")
    return user


def require_auth(*roles: Role):
    allowed = {r.value if isinstance(r, Role) else str(r) for r in roles}

    def decorator(f):
        wants_user = "userAuth" in inspect.signature(f).parameters

        @wraps(f)
        def wrapper(*args, **kwargs):
            user = _authenticate()
            if allowed and user.role.value not in allowed:
                raise ForbiddenError("You do not have permission to perform this action")

            g.current_user = user
            if wants_user:
                kwargs["userAuth"] = user
            return f(*args, **kwargs)

        return wrapper

    return decorator


def current_user() -> User | None:
    return g.get("current_user")
