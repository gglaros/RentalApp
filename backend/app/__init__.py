from flask import Flask, send_from_directory
from flask_cors import CORS

from app.config import settings
from app.database.db.engine import engine
from app.database.db.base import Base
from app.database.db.session import remove_scoped_session
from app.database.db.schema_updates import apply_schema_updates
from app.api.errors import register_error_handlers
from app.cli import register_cli
from app.logging_config import configure_logging
from app.api.v1.users_routes import bp as users_bp
from app.api.v1.properties_routes import bp as properties_bp
from app.api.v1.owner_routes import bp as owners_bp
from app.api.v1.ownerApplication_routes import bp as ownerApps_bp
from app.api.v1.tenant_routes import bp as tenants_bp
from app.api.v1.admin_routes import bp as admin_bp
from app.security_headers import register_security_headers
import os


def create_app() -> Flask:
    app = Flask(__name__)
    configure_logging(app)

    app.config["SECRET_KEY"] = settings.SECRET_KEY
    app.config["MAX_CONTENT_LENGTH"] = settings.MAX_CONTENT_LENGTH
    app.config["PROPERTY_UPLOAD_FOLDER"] = settings.UPLOAD_FOLDER
    os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)

    CORS(app, origins=settings.CORS_ORIGINS)

    Base.metadata.create_all(bind=engine)
    apply_schema_updates(engine)
    register_error_handlers(app)
    register_security_headers(app)
    register_cli(app)

    @app.route("/uploads/properties/<filename>")
    def uploaded_property_image(filename):
        return send_from_directory(settings.UPLOAD_FOLDER, filename)

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
