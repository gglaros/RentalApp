#__init__.py
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
from app.database.db.engine import engine
from app.database.db.base import Base
from app.database.db.session import remove_scoped_session
from app.api.v1.users_routes import bp as users_bp
from app.api.v1.properties_routes import bp as properties_bp
from app.api.v1.owner_routes import bp as owners_bp
from app.api.v1.ownerApplication_routes import bp as ownerApps_bp
from app.api.v1.tenant_routes import bp as tenants_bp
from app.api.v1.admin_routes import bp as admin_bp
from app.api.errors import register_error_handlers
from datetime import timedelta


def create_app() -> Flask:
   
    app = Flask(__name__)
    Base.metadata.create_all(bind=engine)
    register_error_handlers(app)
    CORS(app)
   
    app.config["JWT_SECRET_KEY"] = "your-secret-key"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    jwt = JWTManager(app)
  
   
   
    app.register_blueprint(users_bp, url_prefix="/api/v1/users")
    app.register_blueprint(properties_bp, url_prefix="/api/v1/properties")
    app.register_blueprint(owners_bp, url_prefix="/api/v1/owners")
    app.register_blueprint(ownerApps_bp, url_prefix="/api/v1/ownerApps")
    app.register_blueprint(tenants_bp, url_prefix="/api/v1/tenants")
    app.register_blueprint(admin_bp, url_prefix="/api/v1/admin")
    
    
   
    @app.teardown_appcontext
    def cleanup(_):
        remove_scoped_session()
    return app