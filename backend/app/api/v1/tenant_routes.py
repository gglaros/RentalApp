from flask import Blueprint, jsonify, Response, json
from app.api.schemas.tenant_application import TenantApplicationOutSchema
from app.database.db.session import session_scope
from app.api.schemas.tenant_schema import TenantSchema
from app.services.tenant_service import TenantService
from app.auth.decorators import require_auth
from app.database.models.users import Role

bp = Blueprint("tenants", __name__)


@bp.get("/all")
@require_auth(Role.ADMIN)
def get_all_tenants():
    tenants= TenantService().list_tenants()
    return Response(json.dumps(TenantSchema(many=True).dump(tenants), sort_keys=False), mimetype="application/json"), 200


@bp.post("/create/app/prop/<int:prop_id>")
@require_auth(Role.TENANT)
def create_tenant_application(userAuth,prop_id):
    with session_scope():
        tenant_app = TenantService().create_tenant_application(userAuth,prop_id)
        return jsonify(TenantApplicationOutSchema().dump(tenant_app)), 201


@bp.get("/my/applications")
@require_auth(Role.TENANT)
def get_my_tenant_applications(userAuth):
    tenant_apps = TenantService().get_my_tenant_applications(userAuth)
    return jsonify(TenantApplicationOutSchema(many=True).dump(tenant_apps)), 200


@bp.delete("/applications/<int:app_id>")
@require_auth(Role.TENANT, Role.ADMIN)
def cancel_tenant_application(app_id, userAuth):
    with session_scope():
        result = TenantService().cancel_tenant_application(app_id, userAuth)
        return jsonify(result), 200
