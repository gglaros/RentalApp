from flask import Blueprint, jsonify
from app.database.db.session import session_scope
from app.api.schemas.owner_application import OwnerApplicationOutSchema
from app.services.owner_service import OwnerService
from app.auth.decorators import require_auth
from app.database.models.users import Role

bp = Blueprint("ownerApps", __name__)


@bp.post("/create/<int:prop_id>")
@require_auth(Role.OWNER)
def create_owner_application(userAuth,prop_id):
    with session_scope():
        owner_app = OwnerService().create_owner_application(userAuth,prop_id)
        return jsonify(OwnerApplicationOutSchema().dump(owner_app)), 201


@bp.delete("/delete/<int:app_id>")
@require_auth(Role.OWNER, Role.ADMIN)
def delete_owner_application(app_id,userAuth):
    with session_scope():
        result = OwnerService().delete_owner_application(app_id,userAuth)
        return jsonify(result), 202
