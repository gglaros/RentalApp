import jwt
from datetime import datetime, timedelta
from jwt import ExpiredSignatureError, InvalidTokenError


SECRET_KEY = "super-secret-key"  
ALGORITHM = "HS256"


def create_access_token(user_id: int, role: str, expires_minutes=60) -> str:
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": expire,
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def decode_token_and_get_user_id(token: str) -> int | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("Decoded payload:", payload)
        return payload.get("user_id")
    except ExpiredSignatureError:
        print("Token expired")
        return None
    except InvalidTokenError:
        print("Invalid token")
        return None
