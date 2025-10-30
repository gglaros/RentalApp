from marshmallow import Schema, fields, validate
from app.api.schemas.properties import PropertyMiniSchema,PropertyOutSchema

# class OwnerApplicationCreateSchema(Schema):
#     status = fields.String(required=False, validate=validate.OneOf(["PENDING","APPROVED","REJECTED"]), load_default="PENDING")
    
    
class OwnerApplicationOutSchema(Schema):
    id = fields.Integer()
    status = fields.String()
    owner_id = fields.Integer()
    property_id = fields.Integer()
    property = fields.Nested(PropertyMiniSchema) 