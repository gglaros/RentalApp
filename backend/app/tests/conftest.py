import os
import tempfile

import pytest

_TMP = tempfile.mkdtemp(prefix="rental-tests-")
os.environ["DATABASE_URL"] = f"sqlite:///{_TMP}/test.db"
os.environ["UPLOAD_FOLDER"] = os.path.join(_TMP, "uploads")
os.environ["APP_ENV"] = "testing"
os.environ["SECRET_KEY"] = "test-secret-key-that-is-long-enough-1234"
os.environ["LOG_LEVEL"] = "WARNING"

from werkzeug.security import generate_password_hash

from app import create_app
from app.config import settings
from app.database.db.base import Base
from app.database.db.engine import engine
from app.database.db.session import get_session, remove_scoped_session
from app.database.models.users import Role, User
from app.tests.helpers import image

PASSWORD = "password123"


@pytest.fixture(scope="session")
def app():
    app = create_app()
    app.config["TESTING"] = True
    return app


@pytest.fixture(autouse=True)
def clean_db(app):
    remove_scoped_session()
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    folder = settings.UPLOAD_FOLDER
    os.makedirs(folder, exist_ok=True)
    for f in os.listdir(folder):
        os.remove(os.path.join(folder, f))
    yield
    remove_scoped_session()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def make_user():
    def _make(email, role):
        session = get_session()
        user = User(email=email, password_hash=generate_password_hash(PASSWORD), role=Role[role])
        session.add(user)
        session.commit()
        user_id = user.id
        remove_scoped_session()
        return user_id
    return _make


@pytest.fixture
def login(client):
    def _login(email):
        r = client.post("/api/v1/users/login", json={"email": email, "password": PASSWORD})
        assert r.status_code == 200, r.get_json()
        return {"Authorization": f"Bearer {r.get_json()['token']}"}
    return _login


@pytest.fixture
def users(make_user, login):
    ids = {
        "owner": make_user("owner@test.com", "OWNER"),
        "owner2": make_user("owner2@test.com", "OWNER"),
        "tenant": make_user("tenant@test.com", "TENANT"),
        "admin": make_user("admin@test.com", "ADMIN"),
    }
    headers = {name: login(f"{name}@test.com") for name in ids}
    return {"ids": ids, "h": headers}


@pytest.fixture
def create_property(client):
    def _create(headers, address="Ermou 10", images=0, **extra):
        data = {
            "address": address, "price": "750", "description": "Nice flat",
            "unit_number": "A1", "square_feet": "80", "year_built": "2005",
            **extra,
        }
        if images:
            data["images"] = [image(f"p{i}.jpg") for i in range(images)]
        r = client.post("/api/v1/properties/", data=data, headers=headers,
                        content_type="multipart/form-data")
        assert r.status_code == 201, r.get_json()
        return r.get_json()
    return _create


@pytest.fixture
def approve_images(client):
    def _approve_images(admin_headers):
        for img in client.get("/api/v1/admin/images/pending", headers=admin_headers).get_json():
            r = client.patch(f"/api/v1/admin/images/{img['id']}", json={"status": "APPROVED"}, headers=admin_headers)
            assert r.status_code == 200, r.get_json()
    return _approve_images


@pytest.fixture
def approve(client):
    def _approve(prop_id, owner_headers, admin_headers):
        app_id = client.post(f"/api/v1/ownerApps/create/{prop_id}", headers=owner_headers).get_json()["id"]
        r = client.patch(f"/api/v1/admin/change/status/{app_id}", json={"status": "APPROVED"}, headers=admin_headers)
        assert r.status_code == 200, r.get_json()
    return _approve
