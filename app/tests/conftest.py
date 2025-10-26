# tests/conftest.py
import pytest
from app import create_app
from app.database.db.session import get_session, remove_scoped_session
from app.database.db.base import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

@pytest.fixture(scope="session")
def app():
    app = create_app()
    app.config["TESTING"] = True
    return app

@pytest.fixture(scope="session")
def db_engine():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session(db_engine):
    Session = scoped_session(sessionmaker(bind=db_engine))
    session = Session()

    # Override global session
    def override_get_session():
        return session
    get_session.override = override_get_session

    yield session
    session.rollback()
    session.close()
    remove_scoped_session()

@pytest.fixture(scope="function")
def client(app, db_session):
    return app.test_client()
