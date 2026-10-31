import pytest
from sqlalchemy.orm import Session

from app.database.db.session import get_session
from app.database.models.property import Property
from app.services.properties_service import PropertiesService
from app.tests.helpers import image, uploads


def count_properties():
    return get_session().query(Property).count()


@pytest.fixture
def no_raise(app):
    app.config["PROPAGATE_EXCEPTIONS"] = False
    yield
    app.config["PROPAGATE_EXCEPTIONS"] = None


def test_failure_after_upload_rolls_back_db_and_files(client, users, monkeypatch, no_raise):
    def boom(self, prop):
        raise RuntimeError("boom")
    monkeypatch.setattr(PropertiesService, "_sync_cover", boom)

    r = client.post("/api/v1/properties/", headers=users["h"]["owner"], content_type="multipart/form-data",
                    data={"address": "Tx Street 1", "price": "5", "description": "d", "unit_number": "A",
                          "square_feet": "5", "year_built": "2000", "images": [image(), image("b.png")]})
    assert r.status_code == 500, r.get_json()
    assert count_properties() == 0
    assert uploads() == []


def test_failed_commit_keeps_files(client, users, create_property, monkeypatch, no_raise):
    prop = create_property(users["h"]["owner"], images=2)

    def fail(self):
        raise RuntimeError("db down")
    monkeypatch.setattr(Session, "commit", fail)
    r = client.delete(f"/api/v1/properties/{prop['id']}", headers=users["h"]["owner"])
    monkeypatch.undo()

    assert r.status_code == 500
    assert len(uploads()) == 2
    assert client.get(f"/api/v1/properties/{prop['id']}", headers=users["h"]["owner"]).status_code == 200


def test_unexpected_error_returns_json_with_cors(client, users, monkeypatch, no_raise):
    monkeypatch.setattr(PropertiesService, "list_all", lambda self: 1 / 0)
    r = client.get("/api/v1/properties/", headers={**users["h"]["admin"], "Origin": "http://localhost:5173"})
    assert r.status_code == 500
    assert r.get_json() == {"error": "Internal server error"}
    assert r.headers.get("Access-Control-Allow-Origin") == "http://localhost:5173"
