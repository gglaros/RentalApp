from marshmallow import Schema, fields, validate
from app.api.schemas.properties import PropertyMiniSchema,PropertyOutSchema


class OwnerApplicationOutSchema(Schema):
    id = fields.Integer()
    status = fields.Function(lambda obj: obj.status.value) 
    owner_id = fields.Integer()
    property_id = fields.Integer()
    property = fields.Nested(PropertyMiniSchema) 
    
    
class OwnerApplicationUpdateSchema(Schema):
    status = fields.String(required=True, validate=validate.OneOf(["PENDING", "APPROVED", "REJECTED"]))