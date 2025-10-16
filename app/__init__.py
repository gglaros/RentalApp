from flask import Flask
from app.db.engine import engine
from app.db.base import Base
from app.db.session import SessionLocalFactory, remove_scoped_session
from app.api.v1.users_routes import bp as users_bp
from app.api.v1.properties_routes import bp as properties_bp

def create_app() -> Flask:
    app = Flask(__name__)

    # create tables (dev-only; παραγωγή → Alembic)
    Base.metadata.create_all(bind=engine)

    # blueprints
    app.register_blueprint(users_bp, url_prefix="/api/v1/users")
    app.register_blueprint(properties_bp, url_prefix="/api/v1/properties")

    # teardown: κλείσιμο session ανά request
    @app.teardown_appcontext
    def cleanup(_: Exception | None):
        remove_scoped_session()

    return app
