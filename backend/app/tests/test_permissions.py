import pytest


@pytest.mark.parametrize("method,url", [
    ("get", "/api/v1/owners/all"),
    ("get", "/api/v1/tenants/all"),
    ("get", "/api/v1/admin/users"),
    ("get", "/api/v1/admin/all/ownerApps"),
    ("get", "/api/v1/properties/"),
])
def test_admin_only_endpoints(client, users, method, url):
    assert getattr(client, method)(url).status_code == 401
    assert getattr(client, method)(url, headers=users["h"]["owner"]).status_code == 403
    assert getattr(client, method)(url, headers=users["h"]["tenant"]).status_code == 403
    assert getattr(client, method)(url, headers=users["h"]["admin"]).status_code == 200


def test_tenant_cannot_create_property(client, users):
    r = client.post("/api/v1/properties/", data={"address": "x"}, headers=users["h"]["tenant"],
                    content_type="multipart/form-data")
    assert r.status_code == 403


def test_tenant_cannot_delete_admin(client, users):
    admin_id = users["ids"]["admin"]
    assert client.delete(f"/api/v1/owners/delete/{admin_id}", headers=users["h"]["tenant"]).status_code == 403
    assert client.get("/api/v1/users/me", headers=users["h"]["admin"]).status_code == 200


def test_user_can_delete_own_account(client, users):
    uid = users["ids"]["owner2"]
    assert client.delete(f"/api/v1/owners/delete/{uid}", headers=users["h"]["owner2"]).status_code == 202


def test_auth_checked_before_validation(client):
    assert client.patch("/api/v1/admin/change/status/1", json={}).status_code == 401
