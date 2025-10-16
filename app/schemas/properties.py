from marshmallow import Schema, fields, validate

class PropertyCreateSchema(Schema):
    address = fields.String(required=True, validate=validate.Length(min=3, max=200))
    price = fields.Integer(required=True)
    description = fields.String(required=True, validate=validate.Length(min=1, max=200))
    square_feet = fields.Integer(required=True)
    year_built = fields.Integer(required=True)
    status = fields.String(required=True, validate=validate.OneOf(["DRAFT","PENDING","APPROVED","REJECTED","HIDDEN"]))
    owner_id = fields.Integer(required=True)

class PropertyOutSchema(Schema):
    id = fields.Int()
    address = fields.String()
    price = fields.Integer()
    description = fields.String()
    square_feet = fields.Integer()
    year_built = fields.Integer()
    status = fields.String()
    owner_id = fields.Integer()
