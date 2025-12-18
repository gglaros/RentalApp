from marshmallow import Schema, fields, validate
from app.api.schemas.properties import PropertyMiniSchema,PropertyOutSchema


class TenantApplicationOutSchema(Schema):
    id = fields.Integer()
    status = fields.String()
    tenant_id = fields.Integer()
    property_id = fields.Integer()
    property = fields.Nested(PropertyMiniSchema) 
    
    
class TenantApplicationUpdateSchema(Schema):
    status = fields.String(required=True, validate=validate.OneOf(["PENDING", "APPROVED", "REJECTED"]))