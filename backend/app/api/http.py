from functools import wraps
from flask import request,jsonify
from marshmallow import Schema

def use_schema(schema_cls: type[Schema]):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            payload = schema_cls().load(request.get_json(silent=True) or {})
            return fn(payload=payload, *args, **kwargs)
        return wrapper
    return decorator


def response_schema(schema_class, many=False, status=200):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            result = f(*args, **kwargs)
            schema = schema_class(many=many)
            return jsonify(schema.dump(result)), status
        return wrapper
    return decorator