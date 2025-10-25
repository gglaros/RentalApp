from flask import Flask
from app.database.db.engine import engine
from app.database.db.base import Base
from app.database.db.session import remove_scoped_session
from app.api.v1.users_routes import bp as users_bp
from app.api.v1.properties_routes import bp as properties_bp
from app.api.errors import register_error_handlers

from app.api.errors import register_error_handlers
def create_app() -> Flask:
   
    app = Flask(__name__)
    Base.metadata.create_all(bind=engine)
    register_error_handlers(app)
   
   
    app.register_blueprint(users_bp, url_prefix="/api/v1/users")
    app.register_blueprint(properties_bp, url_prefix="/api/v1/properties")
   
    @app.teardown_appcontext
    def cleanup(_):
        remove_scoped_session()
    return app