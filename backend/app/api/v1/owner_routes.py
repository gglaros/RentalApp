from flask import Blueprint, request, jsonify,Response,json
from marshmallow import ValidationError
from app.api.schemas.tenant_application import TenantApplicationOutSchema
from app.database.db.session import session_scope
from app.api.schemas.users import UserCreateSchema, UserOutSchema,UserUpdateSchema
from app.api.schemas.owner_schema import OwnerSchema
from app.api.schemas.properties import PropertyOutSchema
from app.services.users_service import UsersService
from app.services.owner_service import OwnerService
from app.api.schemas.tenant_application import TenantApplicationOutSchema,TenantApplicationUpdateSchema
from app.api.schemas.tenant_schema import TenantSchema
from app.api.schemas.owner_requests import RequestsOutSchema
from app.auth.admin import admin_authenticate
from app.auth.decorators import authenticate
from app.api.http import use_schema,response_schema

bp = Blueprint("owners", __name__)



@bp.get("/all")
def list_owners():
    users = OwnerService().list_owners()
    return Response(json.dumps(UserOutSchema(many=True).dump(users), sort_keys=False), mimetype="application/json"), 200



@bp.delete("/delete/<int:owner_id>")        # delete my profile
@authenticate(require_user=True)
def delete_user(owner_id:int,userAuth):
    with session_scope():
        result = OwnerService().delete_owner(owner_id,userAuth)
        return jsonify(result), 202
    

@bp.get("/requests")
@authenticate(require_user=True)
def get_requests(userAuth):
    result = OwnerService().get_all_requests(userAuth)
    schema = RequestsOutSchema(many=True)
    return jsonify(schema.dump(result)), 200


@bp.delete("/delete/request/<int:request_id>")
@authenticate(require_user=True)
def delete_request(request_id:int,userAuth):
    with session_scope():
     result = OwnerService().delete_request(request_id,userAuth)
     return jsonify(result)



@bp.patch("/change/request/status/<int:tenantApp_id>")
@use_schema(TenantApplicationUpdateSchema)
@authenticate(require_user=True)
def change_status(tenantApp_id,payload,userAuth):
    with session_scope():
      tenant_app = OwnerService().update_tenant_application_status(tenantApp_id,**payload)
      return jsonify(TenantApplicationOutSchema().dump(tenant_app)),200
    


