from flask import Blueprint, jsonify, Response, json
from app.database.db.session import session_scope
from app.api.schemas.users import UserOutSchema
from app.services.owner_service import OwnerService
from app.api.schemas.tenant_application import TenantApplicationOutSchema,TenantApplicationUpdateSchema
from app.api.schemas.owner_requests import RequestsOutSchema
from app.auth.decorators import require_auth
from app.database.models.users import Role
from app.api.http import use_schema

bp = Blueprint("owners", __name__)


@bp.get("/all")
@require_auth(Role.ADMIN)
def list_owners():
    users = OwnerService().list_owners()
    return Response(json.dumps(UserOutSchema(many=True).dump(users), sort_keys=False), mimetype="application/json"), 200


@bp.delete("/delete/<int:owner_id>")
@require_auth()
def delete_user(owner_id:int,userAuth):
    with session_scope():
        result = OwnerService().delete_owner(owner_id,userAuth)
        return jsonify(result), 202


@bp.get("/requests")
@require_auth(Role.OWNER, Role.ADMIN)
def get_requests(userAuth):
    result = OwnerService().get_all_requests(userAuth)
    schema = RequestsOutSchema(many=True)
    return jsonify(schema.dump(result)), 200


@bp.delete("/delete/request/<int:request_id>")
@require_auth(Role.OWNER, Role.ADMIN)
def delete_request(request_id:int,userAuth):
    with session_scope():
     result = OwnerService().delete_request(request_id,userAuth)
     return jsonify(result)


@bp.patch("/change/request/status/<int:tenantApp_id>")
@require_auth(Role.OWNER, Role.ADMIN)
@use_schema(TenantApplicationUpdateSchema)
def change_status(tenantApp_id, payload, userAuth):
    with session_scope():
      tenant_app = OwnerService().update_tenant_application_status(tenantApp_id, userAuth, **payload)
      return jsonify(TenantApplicationOutSchema().dump(tenant_app)),200
