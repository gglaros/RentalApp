from flask import Blueprint, request, jsonify
from app.database.db.session import session_scope
from app.api.schemas.properties import (
    PropertyCreateSchema,
    PropertyOutSchema,
    PropertyUpdateSchema,
)
from app.services.properties_service import PropertiesService
from app.common.exceptions import BadRequestError
from app.api.http import use_schema, response_schema
from app.auth.decorators import require_auth
from app.database.models.users import Role


bp = Blueprint("properties", __name__)


def _uploaded_images():
    return request.files.getlist("images") + request.files.getlist("image")


def _int_arg(name):
    value = request.args.get(name)
    if value in (None, ""):
        return None
    try:
        return int(value)
    except ValueError:
        raise BadRequestError(f"Query parameter '{name}' must be an integer")


@bp.post("/")
@require_auth(Role.OWNER)
@use_schema(PropertyCreateSchema)
def create_property(payload, userAuth):
    with session_scope():
        prop = PropertiesService().create(userAuth, files=_uploaded_images(), **payload)
        return jsonify(PropertyOutSchema().dump(prop)), 201


@bp.get("/<int:prop_id>")
@require_auth()
@response_schema(PropertyOutSchema)
def get_property(prop_id: int, userAuth):
    with session_scope():
        prop = PropertiesService().get(prop_id, userAuth)
        return prop


@bp.get("/public/<int:prop_id>")
def get_public_property(prop_id: int):
    prop = PropertiesService().get_public(prop_id)
    return jsonify(PropertyOutSchema().dump(prop)), 200


@bp.get("/approved")
def get_approved_properties():
    with session_scope():
        props = PropertiesService().get_approved_properties(
            q=request.args.get("q") or None,
            min_price=_int_arg("min_price"),
            max_price=_int_arg("max_price"),
            min_sqft=_int_arg("min_sqft"),
            max_sqft=_int_arg("max_sqft"),
            sort=request.args.get("sort", "newest"),
        )
        return jsonify(PropertyOutSchema(many=True).dump(props))


@bp.get("/")
@require_auth(Role.ADMIN)
def list_all_properties():
    props = PropertiesService().list_all()
    return jsonify(PropertyOutSchema(many=True).dump(props))


@bp.get("/owner/<int:owner_id>")
@require_auth()
def list_owner_properties(owner_id: int, userAuth):
    with session_scope():
        props = PropertiesService().list_by_owner(owner_id, userAuth)
        return jsonify(PropertyOutSchema(many=True).dump(props)), 200


@bp.put("/<int:prop_id>")
@require_auth(Role.OWNER)
@use_schema(PropertyUpdateSchema)
def update_property(payload, prop_id: int, userAuth):
    with session_scope():
        prop = PropertiesService().update(prop_id, userAuth, **payload)
        return jsonify(PropertyOutSchema().dump(prop)), 200


@bp.delete("/<int:prop_id>")
@require_auth(Role.OWNER, Role.ADMIN)
def delete_property(prop_id: int, userAuth):
    with session_scope():
        result = PropertiesService().delete(prop_id, userAuth)
        return jsonify(result)


@bp.post("/<int:prop_id>/images")
@require_auth(Role.OWNER, Role.ADMIN)
def add_property_images(prop_id: int, userAuth):
    with session_scope():
        prop = PropertiesService().add_images(prop_id, userAuth, _uploaded_images())
        return jsonify(PropertyOutSchema().dump(prop)), 201


@bp.delete("/<int:prop_id>/images/<int:image_id>")
@require_auth(Role.OWNER, Role.ADMIN)
def delete_property_image(prop_id: int, image_id: int, userAuth):
    with session_scope():
        prop = PropertiesService().delete_image(prop_id, image_id, userAuth)
        return jsonify(PropertyOutSchema().dump(prop)), 200


@bp.patch("/<int:prop_id>/images/<int:image_id>/cover")
@require_auth(Role.OWNER, Role.ADMIN)
def set_property_cover(prop_id: int, image_id: int, userAuth):
    with session_scope():
        prop = PropertiesService().set_cover(prop_id, image_id, userAuth)
        return jsonify(PropertyOutSchema().dump(prop)), 200
