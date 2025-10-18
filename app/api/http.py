from functools import wraps
from flask import request
from marshmallow import Schema

def use_schema(schema_cls: type[Schema]):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            payload = schema_cls().load(request.get_json(silent=True) or {})
            return fn(payload=payload, *args, **kwargs)
        return wrapper
    return decorator
