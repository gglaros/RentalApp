from marshmallow import Schema, fields, validate
from marshmallow import validates_schema,Schema,fields, validates, ValidationError,validate
from app.database.models.users import User
from app.database.db.session import get_session

class UserCreateSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))
    role = fields.String(required=True, validate=validate.OneOf(["OWNER", "TENANT","ADMIN"]))
    first_name = fields.String(load_default=None)
    last_name = fields.String(load_default=None)
    phone = fields.String(load_default=None,validate=validate.Length(min=10, max=15))
    
    @validates_schema
    def validate_user_exists(self, data, **kwargs):
      if "email" in data:
           if get_session().query(User).filter_by(email=data["email"]).first():
             raise ValidationError({"email": "Email already registered in schemas"})
        



class UserOutSchema(Schema):
    id = fields.Int()
    email = fields.Email()
    role = fields.String()
    first_name = fields.String(allow_none=True)
    last_name = fields.String(allow_none=True)
    phone = fields.String(allow_none=True)
  


class UserUpdateSchema(Schema):
    email= fields.Email(load_default=None)
    first_name= fields.String(load_default=None)
    last_name = fields.String(load_default=None)
    phone = fields.String(load_default=None,validate=validate.Length(min=10, max=15))


