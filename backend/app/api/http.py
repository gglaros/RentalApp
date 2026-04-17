from functools import wraps

from flask import request,jsonify
from marshmallow import Schema
from termcolor import colored

# def use_schema(schema_cls: type[Schema]):
#     def decorator(fn):
#         @wraps(fn)
#         def wrapper(*args, **kwargs):
#             payload = schema_cls().load(request.get_json(silent=True) or {})
#             return fn(payload=payload, *args, **kwargs)
#         return wrapper
#     return decorator



def use_schema(schema_class: type[Schema]):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            content_type = request.content_type or ""

            if content_type.startswith("multipart/form-data"):
                data = request.form.to_dict()
            else:
                data = request.get_json(silent=True) or {}
            print(colored(args,  'blue'))
            print(colored(kwargs, 'blue'))  # {'tenantApp_id': 5}
            payload = schema_class().load(data)  # validation κανονικά
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