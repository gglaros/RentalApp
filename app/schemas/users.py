from marshmallow import Schema, fields, validate

class UserCreateSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))
    role = fields.String(required=True, validate=validate.OneOf(["OWNER", "TENANT"]))
    first_name = fields.String(load_default=None)
    last_name  = fields.String(load_default=None)
    phone      = fields.String(load_default=None)

class UserOutSchema(Schema):
    id = fields.Int()
    email = fields.Email()
    role = fields.String()
    first_name = fields.String(allow_none=True)
    last_name = fields.String(allow_none=True)
    phone = fields.String(allow_none=True)


class UserUpdateSchema(Schema):
    email      = fields.Email(load_default=None)
    first_name = fields.String(load_default=None)
    last_name  = fields.String(load_default=None)
    phone      = fields.String(load_default=None)
    role       = fields.String(validate=validate.OneOf(["OWNER","TENANT","ADMIN"]), load_default=None)
    is_active  = fields.Boolean(load_default=None)
    

# class UserDeleteSchema(Schema):
#     # π.χ. DELETE /api/v1/users/5?force=true
#     force = fields.Boolean(load_default=False)