from marshmallow import Schema, fields, validate
from app.api.schemas.properties import PropertyOutSchema
from app.api.schemas.owner_application import OwnerApplicationOutSchema
# from app.api.schemas.tenant_application import TenantApplicationOutSchema
from app.api.schemas.owner_requests import RequestsOutSchema

class OwnerSchema(Schema):
    class Meta:
        ordered = True
    id = fields.Int()    
    first_name = fields.String()
    last_name = fields.String()
    phone= fields.String()
    email = fields.Email()
    role = fields.Function(lambda obj: obj.role.value)
    properties = fields.List(fields.Nested(PropertyOutSchema))
    owner_applications = fields.List(fields.Nested(OwnerApplicationOutSchema))
    tenant_applications_to_own_properties = fields.List(fields.Nested(RequestsOutSchema))
   