from flask import g, has_request_context
from marshmallow import Schema, fields, validate, EXCLUDE

from app.api.schemas.users import UserOutSchema


class PropertyCreateSchema(Schema):
    address = fields.String(required=True, validate=validate.Length(min=3, max=200))
    price = fields.Int(required=True, validate=validate.Range(min=1))
    description = fields.String(required=True, validate=validate.Length(min=1, max=200))
    unit_number = fields.String(required=True, validate=validate.Length(min=1, max=10))
    square_feet = fields.Integer(required=True , validate=validate.Range(min=1))
    year_built = fields.Integer(required=True ,validate=validate.Range(min=1))

    class Meta:
        unknown = EXCLUDE


class PropertyImageSchema(Schema):
    id = fields.Int(allow_none=True)
    path = fields.String()
    position = fields.Int()
    status = fields.String()


def _can_see_pending(prop) -> bool:
    viewer = g.get("current_user") if has_request_context() else None
    if viewer is None:
        return False
    return viewer.role.value == "ADMIN" or viewer.id == prop.owner_id


def _images_of(prop):
    imgs = list(getattr(prop, "images", None) or [])
    if imgs:
        if not _can_see_pending(prop):
            imgs = [i for i in imgs if i.status == "APPROVED"]
        return PropertyImageSchema(many=True).dump(imgs)
    if getattr(prop, "image", None):
        return [{"id": None, "path": prop.image, "position": 0, "status": "APPROVED"}]
    return []


class PropertyOutSchema(Schema):
    id = fields.Int()
    owner_id = fields.Int()
    address = fields.String()
    price = fields.Integer()
    description = fields.String()
    unit_number = fields.String()
    square_feet = fields.Integer()
    year_built = fields.Integer()
    status = fields.String()
    image = fields.String()
    images = fields.Function(_images_of)
    owner = fields.Nested(UserOutSchema)


class PropertyUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    address = fields.String(validate=validate.Length(min=3, max=200), load_default=None)
    price = fields.Int(validate=validate.Range(min=1), load_default=None)
    description = fields.String(validate=validate.Length(min=1, max=200), load_default=None)
    unit_number = fields.String(validate=validate.Length(min=1, max=10), load_default=None)
    square_feet = fields.Integer(validate=validate.Range(min=1), load_default=None)
    year_built = fields.Integer(validate=validate.Range(min=1), load_default=None)


class PropertyMiniSchema(Schema):
    id = fields.Int()
    image = fields.String()
    address = fields.String()
    unit_number = fields.String()
    description= fields.String()
    year_built = fields.String()
    owner = fields.Nested(UserOutSchema)

class PropertySchema(Schema):
    id = fields.Int()
    address = fields.String()
    unit_number = fields.String()
    description= fields.String()
    year_built = fields.String()


class PendingImageSchema(Schema):
    id = fields.Int()
    path = fields.String()
    created_at = fields.DateTime()
    property_id = fields.Int()
    property_address = fields.Function(lambda img: img.property.address)
    property_status = fields.Function(lambda img: img.property.status)
    owner_email = fields.Function(lambda img: img.property.owner.email if img.property.owner else None)


class ImageReviewSchema(Schema):
    status = fields.String(required=True, validate=validate.OneOf(["APPROVED", "REJECTED"]))
