# tests/test_properties.py
from app.database.models.users import User, Role
from app.database.models.property import Property
from werkzeug.security import generate_password_hash
from app.auth.token_utils import create_access_token
from sqlalchemy.orm import sessionmaker, scoped_session
import pytest

def create_user(session, email, role):
    user = User(email=email, role=Role[role], password_hash=generate_password_hash("123"))
    session.add(user)
    session.commit()
    return user

def auth_headers(user):
    token = create_access_token(user)
    return {"Authorization": f"Bearer {token}"}

def test_tenant_cannot_create_property(client, db_session):
    tenant = create_user(db_session, "tenant1@example.com", "TENANT")

    res = client.post("/api/v1/properties/", json={
        "address": "123 Fake St",
        "unit_number": "A",
        "price": 500,
        "description": "Nice place",
        "square_feet": 55,
        "year_built": 2005,
        "status": "DRAFT"
    }, headers=auth_headers(tenant))

    assert res.status_code == 403
    assert b"Only owners can perform this action" in res.data

def test_owner_can_create_and_delete_own_property(client, db_session):
    owner = create_user(db_session, "owner1@example.com", "OWNER")

    # Create
    res = client.post("/api/v1/properties/", json={
        "address": "456 Real St",
        "unit_number": "1",
        "price": 800,
        "description": "Very nice",
        "square_feet": 70,
        "year_built": 2010,
        "status": "DRAFT"
    }, headers=auth_headers(owner))
    assert res.status_code == 201
    prop_id = res.get_json()["id"]

    # Delete
    res = client.delete(f"/api/v1/properties/{prop_id}", headers=auth_headers(owner))
    assert res.status_code == 200 or res.status_code == 202
    assert b"Property deleted" in res.data

def test_owner_cannot_delete_others_property(client, db_session):
    owner1 = create_user(db_session, "owner1@example.com", "OWNER")
    owner2 = create_user(db_session, "owner2@example.com", "OWNER")

    # Owner1 creates property
    property = Property(
        address="789 Other St",
        unit_number="2",
        price=900,
        description="Owner1 prop",
        square_feet=90,
        year_built=2015,
        status="DRAFT",
        owner_id=owner1.id
    )
    db_session.add(property)
    db_session.commit()

    # Owner2 tries to delete
    res = client.delete(f"/api/v1/properties/{property.id}", headers=auth_headers(owner2))
    assert res.status_code == 400 or res.status_code == 403
    assert b"do not have permission" in res.data
