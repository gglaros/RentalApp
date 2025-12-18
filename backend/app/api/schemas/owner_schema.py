from marshmallow import Schema, fields, validate
from app.api.schemas.properties import PropertyOutSchema
from app.api.schemas.owner_application import OwnerApplicationOutSchema


class OwnerSchema(Schema):
    class Meta:
        ordered = True
    first_name = fields.String()
    email = fields.Email()
    role = fields.Function(lambda obj: obj.role.value)
    properties = fields.List(fields.Nested(PropertyOutSchema))
    owner_applications = fields.List(fields.Nested(OwnerApplicationOutSchema))
