from flask import Blueprint, request, jsonify,Response,json
from marshmallow import ValidationError
from app.database.db.session import session_scope
from app.api.schemas.users import UserCreateSchema, UserOutSchema,UserUpdateSchema
from app.api.schemas.owner_schema import OwnerSchema
from app.api.schemas.owner_application import  OwnerApplicationOutSchema,OwnerApplicationUpdateSchema
from app.api.schemas.properties import PropertyOutSchema
from app.services.users_service import UsersService
from app.services.owner_service import OwnerService
from app.api.http import use_schema,response_schema
from app.auth.admin import admin_authenticate
from app.auth.decorators import authenticate

bp = Blueprint("ownerApps", __name__)



@bp.get("/all")
@admin_authenticate(require_admin=True)
def list_owner_applications():
    owner_apps = OwnerService().list_owner_applications()
    return Response(json.dumps(OwnerApplicationOutSchema(many=True).dump(owner_apps), sort_keys=False), mimetype="application/json"), 200


@bp.post("/create/<int:prop_id>")        
@authenticate(require_user=True)
def create_owner_application(userAuth,prop_id):
    with session_scope():
        owner_app = OwnerService().create_owner_application(userAuth,prop_id)
        return jsonify(OwnerApplicationOutSchema().dump(owner_app)), 201
    


@bp.put("/change/status/<int:app_id>")
@use_schema(OwnerApplicationUpdateSchema)
@admin_authenticate(require_admin=True)
def update_owner_application_status(payload, app_id):
    with session_scope():
        owner_app = OwnerService().update_owner_application_status(app_id, **payload)
        return jsonify(OwnerApplicationOutSchema().dump(owner_app)), 200
    
    
@bp.delete("/delete/<int:app_id>")
@authenticate(require_user=True)
def delete_owner_application(app_id,userAuth):
    with session_scope():
        result = OwnerService().delete_owner_application(app_id,userAuth)
        return jsonify(result), 202