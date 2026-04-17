from flask import Blueprint, request, jsonify
import os
import uuid
from flask.views import MethodView
from marshmallow import ValidationError
from app.database.db.session import get_session
from app.database.db.session import session_scope
from app.api.schemas.properties import (
    PropertyCreateSchema,
    PropertyOutSchema,
    PropertyUpdateSchema,
)
from app.services.properties_service import PropertiesService
from flask import current_app
from app.common.exceptions import BadRequestError, NotFoundError
from app.api.http import use_schema, response_schema
from flask_jwt_extended import get_jwt, jwt_required
from app.auth.decorators import authenticate
from app.auth.admin import admin_authenticate
from werkzeug.utils import secure_filename


UPLOAD_FOLDER = "uploads/properties"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


bp = Blueprint("properties", __name__)


# TODO FIX IMAGE
@bp.post("/")
@authenticate(require_user=True)
@use_schema(PropertyCreateSchema)
def create_property(payload, userAuth):  # user from authenticate
    with session_scope():
        print("\033[31mHello World create property\033[0m")
        print("FORM:", request.form)
        print("FILES:", request.files)
        print("IMAGE:", request.files.get("image"))
        print("PAYLOAD:", payload)
        image = request.files.get("image")

        if image and image.filename:
            if not allowed_file(image.filename):
                raise BadRequestError("Invalid image type")

            os.makedirs(UPLOAD_FOLDER, exist_ok=True)

            ext = image.filename.rsplit(".", 1)[1].lower()
            filename = secure_filename(f"{uuid.uuid4().hex}.{ext}")
            image_path = os.path.join(UPLOAD_FOLDER, filename)

            image.save(image_path)

            payload["image"] = image_path

        prop = PropertiesService().create(userAuth, **payload)
        return jsonify(PropertyOutSchema().dump(prop)), 201


@bp.get("/<int:prop_id>")
@authenticate(require_user=True)
@response_schema(PropertyOutSchema)
def get_property(prop_id: int, userAuth):
    with session_scope():
        prop = PropertiesService().get(prop_id, userAuth)
        return prop


@bp.get("/approved")
def get_approved_properties():
    with session_scope():
        props = PropertiesService().get_approved_properties()
        return jsonify(PropertyOutSchema(many=True).dump(props))


@bp.get("/")
@admin_authenticate(require_admin=True)
def list_all_properties():
    props = PropertiesService().list_all()
    return jsonify(PropertyOutSchema(many=True).dump(props))


@bp.get("/owner/<int:owner_id>")
@authenticate(require_user=True)
def list_owner_properties(owner_id: int, userAuth):
    with session_scope():
        props = PropertiesService().list_by_owner(owner_id, userAuth)
        return jsonify(PropertyOutSchema(many=True).dump(props)), 200


@bp.put("/<int:prop_id>")
@authenticate(require_user=True)
@use_schema(PropertyUpdateSchema)
def update_property(payload, prop_id: int, userAuth):
    with session_scope():
        prop = PropertiesService().update(prop_id, userAuth, **payload)
        return jsonify(PropertyOutSchema().dump(prop)), 200


@bp.delete("/<int:prop_id>")
@authenticate(require_user=True)
def delete_property(prop_id: int, userAuth):
    with session_scope():
        result = PropertiesService().delete(prop_id, userAuth)
        return jsonify(result)
