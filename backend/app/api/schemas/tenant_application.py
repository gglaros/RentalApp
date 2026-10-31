from marshmallow import Schema, fields, validate
from app.api.schemas.properties import PropertyMiniSchema


class TenantApplicationOutSchema(Schema):
    id = fields.Integer()
    status = fields.Function(lambda obj: obj.status.value)
    tenant_id = fields.Integer()
    property = fields.Nested(PropertyMiniSchema)


class TenantApplicationUpdateSchema(Schema):
    status = fields.String(required=True, validate=validate.OneOf(["PENDING", "APPROVED", "REJECTED"]))
