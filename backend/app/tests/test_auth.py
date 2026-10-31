import time

import jwt


def test_signup_and_login(client, login):
    r = client.post("/api/v1/users/", json={"email": "new@test.com", "password": "password123", "role": "TENANT"})
    assert r.status_code == 201
    assert "Authorization" in login("new@test.com")


def test_cannot_signup_as_admin(client):
    r = client.post("/api/v1/users/", json={"email": "h@test.com", "password": "password123", "role": "ADMIN"})
    assert r.status_code == 400


def test_duplicate_email(client):
    body = {"email": "dup@test.com", "password": "password123", "role": "TENANT"}
    assert client.post("/api/v1/users/", json=body).status_code == 201
    assert client.post("/api/v1/users/", json=body).status_code in (400, 409)


def test_wrong_password_is_401(client, users):
    r = client.post("/api/v1/users/login", json={"email": "owner@test.com", "password": "wrong-pass"})
    assert r.status_code == 401


def test_me_requires_token(client):
    assert client.get("/api/v1/users/me").status_code == 401
    assert client.get("/api/v1/users/me", headers={"Authorization": "Token abc"}).status_code == 401
    assert client.get("/api/v1/users/me", headers={"Authorization": "Bearer garbage"}).status_code == 401


def test_expired_token_is_401(client, users):
    expired = jwt.encode({"userId": users["ids"]["owner"], "exp": int(time.time()) - 5},
                         "test-secret-key-that-is-long-enough-1234", algorithm="HS256")
    r = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {expired}"})
    assert r.status_code == 401
    assert r.get_json()["error"] == "Token has expired"


def test_logout_revokes_token(client, users):
    h = users["h"]["tenant"]
    assert client.get("/api/v1/users/me", headers=h).status_code == 200
    assert client.post("/api/v1/users/logout", headers=h).status_code == 200
    assert client.get("/api/v1/users/me", headers=h).status_code == 401


def test_update_profile_without_password(client, users):
    uid = users["ids"]["owner"]
    r = client.put(f"/api/v1/users/edit/{uid}", json={"first_name": "Giorgos"}, headers=users["h"]["owner"])
    assert r.status_code == 200
    assert r.get_json()["first_name"] == "Giorgos"


def test_cannot_update_other_user(client, users):
    other = users["ids"]["owner2"]
    r = client.put(f"/api/v1/users/edit/{other}", json={"first_name": "X"}, headers=users["h"]["owner"])
    assert r.status_code == 403


def test_create_admin_cli(app, client):
    runner = app.test_cli_runner()
    result = runner.invoke(args=["create-admin", "boss@test.com", "--password", "supersecret"])
    assert result.exit_code == 0
    r = client.post("/api/v1/users/login", json={"email": "boss@test.com", "password": "supersecret"})
    assert r.get_json()["user"]["role"] == "ADMIN"
    assert runner.invoke(args=["create-admin", "boss@test.com", "--password", "supersecret"]).exit_code == 1
    assert runner.invoke(args=["create-admin", "x@test.com", "--password", "short"]).exit_code == 1


def test_cors_only_allows_frontend(client):
    ok = client.get("/api/v1/properties/approved", headers={"Origin": "http://localhost:5173"})
    evil = client.get("/api/v1/properties/approved", headers={"Origin": "http://evil.com"})
    assert ok.headers.get("Access-Control-Allow-Origin") == "http://localhost:5173"
    assert evil.headers.get("Access-Control-Allow-Origin") is None
