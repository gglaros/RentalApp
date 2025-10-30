from flask import Blueprint, request, jsonify,Response,json
from marshmallow import ValidationError
from app.database.db.session import session_scope
from app.api.schemas.users import UserCreateSchema, UserOutSchema,UserUpdateSchema
from app.api.schemas.owner_schema import OwnerSchema
from app.api.schemas.owner_application import  OwnerApplicationOutSchema
from app.api.schemas.properties import PropertyOutSchema
from app.services.users_service import UsersService
from app.services.owner_service import OwnerService
from app.api.http import use_schema,response_schema
from app.auth.admin import admin_authenticate
from app.auth.decorators import authenticate

bp = Blueprint("ownerApps", __name__)


@bp.post("/create/<int:prop_id>")        
@authenticate(require_user=True)
def create_owner_application(userAuth,prop_id):
    with session_scope():
        owner_app = OwnerService().create_owner_application(userAuth,prop_id)
        return jsonify(OwnerApplicationOutSchema().dump(owner_app)), 201
    
    
@bp.get("/all")
def list_owner_applications():
    owner_apps = OwnerService().list_owner_applications()
    return Response(json.dumps(OwnerApplicationOutSchema(many=True).dump(owner_apps), sort_keys=False), mimetype="application/json"), 200