def test_tenant_application_flow(client, users, create_property, approve):
    h = users["h"]
    prop = create_property(h["owner"])

    assert client.post(f"/api/v1/tenants/create/app/prop/{prop['id']}", headers=h["tenant"]).status_code == 404

    approve(prop["id"], h["owner"], h["admin"])
    r = client.post(f"/api/v1/tenants/create/app/prop/{prop['id']}", headers=h["tenant"])
    assert r.status_code == 201
    app_id = r.get_json()["id"]

    assert client.post(f"/api/v1/tenants/create/app/prop/{prop['id']}", headers=h["tenant"]).status_code == 409
    assert client.post(f"/api/v1/tenants/create/app/prop/{prop['id']}", headers=h["owner"]).status_code == 403

    mine = client.get("/api/v1/tenants/my/applications", headers=h["tenant"]).get_json()
    assert [a["id"] for a in mine] == [app_id]

    url = f"/api/v1/owners/change/request/status/{app_id}"
    assert client.patch(url, json={"status": "APPROVED"}, headers=h["owner2"]).status_code == 403
    assert client.patch(url, json={"status": "APPROVED"}, headers=h["tenant"]).status_code == 403
    r = client.patch(url, json={"status": "APPROVED"}, headers=h["owner"])
    assert r.status_code == 200
    assert r.get_json()["status"] == "APPROVED"


def test_tenant_cancels_own_application(client, users, create_property, approve):
    h = users["h"]
    prop = create_property(h["owner"])
    approve(prop["id"], h["owner"], h["admin"])
    app_id = client.post(f"/api/v1/tenants/create/app/prop/{prop['id']}", headers=h["tenant"]).get_json()["id"]

    assert client.delete(f"/api/v1/tenants/applications/{app_id}", headers=h["owner"]).status_code == 403
    assert client.delete(f"/api/v1/tenants/applications/{app_id}", headers=h["tenant"]).status_code == 200


def test_owner_and_admin_delete_request(client, users, create_property, approve):
    h = users["h"]
    prop = create_property(h["owner"])
    approve(prop["id"], h["owner"], h["admin"])
    app_id = client.post(f"/api/v1/tenants/create/app/prop/{prop['id']}", headers=h["tenant"]).get_json()["id"]

    assert client.delete(f"/api/v1/owners/delete/request/{app_id}", headers=h["owner2"]).status_code == 403
    assert client.delete(f"/api/v1/owners/delete/request/{app_id}", headers=h["admin"]).status_code == 200


def test_admin_approval_makes_property_public(client, users, create_property, approve):
    h = users["h"]
    prop = create_property(h["owner"])
    assert client.get(f"/api/v1/properties/public/{prop['id']}").status_code == 404
    approve(prop["id"], h["owner"], h["admin"])
    assert client.get(f"/api/v1/properties/public/{prop['id']}").status_code == 200
