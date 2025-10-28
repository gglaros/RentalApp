from marshmallow import Schema, fields, validate
from app.api.schemas.properties import PropertyOutSchema


class OwnerSchema(Schema):
    class Meta:
        ordered = True
    first_name = fields.String()
    email = fields.Email()
    role = fields.String()
    properties = fields.List(fields.Nested(PropertyOutSchema))
