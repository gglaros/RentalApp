from flask import Blueprint, request, jsonify,Response,json
from marshmallow import ValidationError
from app.api.schemas.tenant_application import TenantApplicationOutSchema
from app.database.db.session import session_scope
from app.api.schemas.users import UserCreateSchema, UserOutSchema,UserUpdateSchema
from app.api.schemas.owner_schema import OwnerSchema
from app.api.schemas.tenant_schema import TenantSchema 
from app.api.schemas.properties import PropertyOutSchema
from app.services.users_service import UsersService
from app.services.owner_service import OwnerService
from app.services.tenant_service import TenantService
from app.api.schemas.owner_application import  OwnerApplicationOutSchema,OwnerApplicationUpdateSchema
from app.auth.admin import admin_authenticate
from app.auth.decorators import authenticate

bp = Blueprint("tenants", __name__)



@bp.get("/all")
def get_all_tenants():
    tenants= TenantService().list_tenants()
    return Response(json.dumps(TenantSchema(many=True).dump(tenants), sort_keys=False), mimetype="application/json"), 200
    


@bp.post("/create/<int:prop_id>")        
@authenticate(require_user=True)
def create_tenant_application(userAuth,prop_id):
    with session_scope():
        tenant_app = TenantService().create_tenant_application(userAuth,prop_id)
        return jsonify(TenantApplicationOutSchema().dump(tenant_app)), 201
    
