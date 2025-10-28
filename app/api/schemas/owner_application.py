from marshmallow import Schema, fields, validate

class OwnerApplicationCreateSchema(Schema):
    status = fields.String(required=False, validate=validate.OneOf(["PENDING","APPROVED","REJECTED"]), load_default="PENDING")
    
    
class OwnerApplicationOutSchema(Schema):
    class Meta:
        ordered = True
    id = fields.Integer()
    status = fields.String()
    owner_id = fields.Integer()
    property_id = fields.Integer()