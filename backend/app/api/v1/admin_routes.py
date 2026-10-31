from app.services.properties_service import PropertiesService
from app.api.schemas.properties import PendingImageSchema, ImageReviewSchema
from flask import Blueprint, jsonify, Response, json
from app.database.db.session import session_scope
from app.api.schemas.users import UserOutSchema
from app.api.schemas.owner_application import  OwnerApplicationOutSchema,OwnerApplicationUpdateSchema
from app.services.users_service import UsersService
from app.services.owner_service import OwnerService
from app.services.auth_service import AuthService
from app.api.http import use_schema
from app.auth.decorators import require_auth
from app.database.models.users import Role


bp = Blueprint("admin", __name__)


@bp.get("/<int:user_id>")
@require_auth(Role.ADMIN)
def get_user(user_id: int):
    user = UsersService().get(user_id)
    schema=AuthService().get_schemas_by_user(user)
    return jsonify(schema.dump(user))


@bp.get("/users")
@require_auth(Role.ADMIN)
def list_users():
    users = UsersService().list()
    return jsonify(UserOutSchema(many=True).dump(users))


@bp.delete("/user/delete/<int:user_id>")
@require_auth(Role.ADMIN)
def delete_user(user_id:int ):
    with session_scope():
        result = UsersService().force_delete_user(user_id)
        return jsonify(result), 202


@bp.patch("/change/status/<int:app_id>")
@require_auth(Role.ADMIN)
@use_schema(OwnerApplicationUpdateSchema)
def update_owner_application_status(payload, app_id):
    with session_scope():
        owner_app = OwnerService().update_owner_application_status(app_id, **payload)
        OwnerService().update_property_status(owner_app)
        return jsonify(OwnerApplicationOutSchema().dump(owner_app)), 200


@bp.get("/all/ownerApps")
@require_auth(Role.ADMIN)
def list_owner_applications():
    owner_apps = OwnerService().list_owner_applications()
    return Response(json.dumps(OwnerApplicationOutSchema(many=True).dump(owner_apps), sort_keys=False), mimetype="application/json"), 200


@bp.get("/images/pending")
@require_auth(Role.ADMIN)
def list_pending_images():
    images = PropertiesService().list_pending_images()
    return jsonify(PendingImageSchema(many=True).dump(images)), 200


@bp.patch("/images/<int:image_id>")
@require_auth(Role.ADMIN)
@use_schema(ImageReviewSchema)
def review_image(payload, image_id: int, userAuth):
    with session_scope():
        result = PropertiesService().review_image(image_id, payload["status"], userAuth)
        return jsonify(result), 200
