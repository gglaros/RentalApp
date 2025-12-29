from marshmallow import Schema, fields, validate
from app.api.schemas.properties import PropertySchema
from app.api.schemas.tenant_schema import TenantMiniSchema



class RequestsOutSchema(Schema):
    id = fields.Integer()
    status = fields.Function(lambda obj: obj.status.value) 
    property = fields.Nested(PropertySchema)
    tenant = fields.Nested(TenantMiniSchema)
   