from marshmallow import Schema, fields, validate

class PropertyCreateSchema(Schema):
    address = fields.String(required=True, validate=validate.Length(min=3, max=200))
    price = fields.Int(required=True, validate=validate.Range(min=1))
    description = fields.String(required=True, validate=validate.Length(min=1, max=200))
    unit_number = fields.String(required=True, validate=validate.Length(min=1, max=10))
    square_feet = fields.Integer(required=True , validate=validate.Range(min=1))
    year_built = fields.Integer(required=True ,validate=validate.Range(min=1))
    status = fields.String(required=True, validate=validate.OneOf(["DRAFT","PENDING","APPROVED","REJECTED","HIDDEN"]))
    # owner_id = fields.Integer(required=True)

class PropertyOutSchema(Schema):
    id = fields.Int()
    address = fields.String()
    price = fields.Integer()
    description = fields.String()
    unit_number = fields.String()
    square_feet = fields.Integer()
    year_built = fields.Integer()
    status = fields.String()
    owner_id = fields.Integer()
    
    
    
class PropertyUpdateSchema(Schema):
    address = fields.String(validate=validate.Length(min=3, max=200), load_default=None)
    price = fields.Int(validate=validate.Range(min=1), load_default=None)
    description = fields.String(validate=validate.Length(min=1, max=200), load_default=None)
    unit_number = fields.String(validate=validate.Length(min=1, max=10), load_default=None)
    square_feet = fields.Integer(validate=validate.Range(min=1), load_default=None)
    year_built = fields.Integer(validate=validate.Range(min=1), load_default=None)


class PropertyMiniSchema(Schema):
    address = fields.String()
    