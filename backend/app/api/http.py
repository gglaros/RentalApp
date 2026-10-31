from functools import wraps

from flask import request,jsonify
from marshmallow import Schema


def use_schema(schema_class: type[Schema]):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            content_type = request.content_type or ""

            if content_type.startswith("multipart/form-data"):
                data = request.form.to_dict()
            else:
                data = request.get_json(silent=True) or {}
            payload = schema_class().load(data)
            return f(*args, payload=payload, **kwargs)
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
