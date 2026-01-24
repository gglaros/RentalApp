import jwt
from datetime import datetime, timedelta, timezone
from termcolor import colored
from uuid import uuid4
from app.common.exceptions import  ConflictError, BadRequestError,NotFoundError, UnauthorizedError

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def create_token(user_id: int, role: str):
    now = datetime.now(timezone.utc)
    exp = now + timedelta(hours=1)
 
    payload = {
        "userId": (user_id),
        "role": role,
        "type": "access",
        "iat": int(now.timestamp()),   # issued at
        "exp": int(exp.timestamp()),   # expires at
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token




def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp_dt_utc = datetime.fromtimestamp(payload.get("exp"), tz=timezone.utc)
        
        print(colored (exp_dt_utc.astimezone(),'red' ))
        print(exp_dt_utc.astimezone() )  
       
        return payload
    except jwt.ExpiredSignatureError:
        raise ConflictError("Token has expired")
    except jwt.InvalidTokenError:
        raise ConflictError("in valid token")
    return None 