from marshmallow import Schema, fields, validate
from app.api.schemas.tenant_application import TenantApplicationOutSchema




class TenantSchema(Schema):
    first_name = fields.String(required=True, validate=validate.Length(min=1))
    email = fields.Email(required=True)
    role = fields.Str()
    phone = fields.String(required=True, validate=validate.Length(min=10, max=15))
    tenant_applications = fields.List(fields.Nested(TenantApplicationOutSchema))
