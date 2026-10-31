from app.tests.helpers import image, uploads


def public_images(client, prop_id):
    return client.get(f"/api/v1/properties/public/{prop_id}").get_json()["images"]


def test_new_photos_are_hidden_until_approved(client, users, create_property, approve):
    h = users["h"]
    prop = create_property(h["owner"], images=2)
    approve(prop["id"], h["owner"], h["admin"])

    assert public_images(client, prop["id"]) == []
    own = client.get(f"/api/v1/properties/{prop['id']}", headers=h["owner"]).get_json()["images"]
    assert [i["status"] for i in own] == ["PENDING", "PENDING"]
    assert len(client.get(f"/api/v1/properties/{prop['id']}", headers=h["admin"]).get_json()["images"]) == 2
    assert client.get(f"/api/v1/properties/{prop['id']}", headers=h["tenant"]).get_json()["images"] == []


def test_admin_queue_and_approve(client, users, create_property, approve):
    h = users["h"]
    prop = create_property(h["owner"], images=2)
    approve(prop["id"], h["owner"], h["admin"])

    queue = client.get("/api/v1/admin/images/pending", headers=h["admin"]).get_json()
    assert len(queue) == 2
    assert queue[0]["owner_email"] == "owner@test.com"
    assert queue[0]["property_address"] == "Ermou 10"

    first = queue[0]["id"]
    r = client.patch(f"/api/v1/admin/images/{first}", json={"status": "APPROVED"}, headers=h["admin"])
    assert r.status_code == 200

    pub = client.get(f"/api/v1/properties/public/{prop['id']}").get_json()
    assert [i["id"] for i in pub["images"]] == [first]
    assert pub["image"] == pub["images"][0]["path"]
    assert len(client.get("/api/v1/admin/images/pending", headers=h["admin"]).get_json()) == 1


def test_reject_deletes_photo_and_file(client, users, create_property):
    h = users["h"]
    prop = create_property(h["owner"], images=1)
    img_id = prop["images"][0]["id"]
    assert len(uploads()) == 1

    r = client.patch(f"/api/v1/admin/images/{img_id}", json={"status": "REJECTED"}, headers=h["admin"])
    assert r.get_json()["deleted"] is True
    assert uploads() == []
    assert client.get(f"/api/v1/properties/{prop['id']}", headers=h["owner"]).get_json()["images"] == []


def test_photos_added_after_approval_need_review(client, users, create_property, approve, approve_images):
    h = users["h"]
    prop = create_property(h["owner"], images=1)
    approve(prop["id"], h["owner"], h["admin"])
    approve_images(h["admin"])
    assert len(public_images(client, prop["id"])) == 1

    client.post(f"/api/v1/properties/{prop['id']}/images", data={"images": [image("new.jpg")]},
                headers=h["owner"], content_type="multipart/form-data")
    assert len(public_images(client, prop["id"])) == 1


def test_only_admin_reviews(client, users, create_property):
    h = users["h"]
    img_id = create_property(h["owner"], images=1)["images"][0]["id"]
    assert client.get("/api/v1/admin/images/pending", headers=h["owner"]).status_code == 403
    assert client.patch(f"/api/v1/admin/images/{img_id}", json={"status": "APPROVED"}, headers=h["owner"]).status_code == 403
    assert client.patch(f"/api/v1/admin/images/{img_id}", json={"status": "MAYBE"}, headers=h["admin"]).status_code == 400


def test_pending_photo_cannot_be_cover(client, users, create_property):
    h = users["h"]
    prop = create_property(h["owner"], images=1)
    img_id = prop["images"][0]["id"]
    r = client.patch(f"/api/v1/properties/{prop['id']}/images/{img_id}/cover", headers=h["owner"])
    assert r.status_code == 400


def test_existing_database_gets_status_column(tmp_path):
    from sqlalchemy import create_engine, text
    from app.database.db.schema_updates import apply_schema_updates

    eng = create_engine(f"sqlite:///{tmp_path}/old.db")
    with eng.begin() as c:
        c.execute(text("CREATE TABLE property_images (id INTEGER PRIMARY KEY, property_id INT, path TEXT, position INT)"))
        c.execute(text("INSERT INTO property_images VALUES (1, 1, 'a.jpg', 0)"))
    apply_schema_updates(eng)
    apply_schema_updates(eng)
    with eng.begin() as c:
        assert c.execute(text("SELECT status FROM property_images")).scalar() == "APPROVED"
