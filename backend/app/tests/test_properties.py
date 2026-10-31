from app.tests.helpers import image, uploads


def test_new_property_is_always_pending(users, create_property):
    prop = create_property(users["h"]["owner"], status="APPROVED")
    assert prop["status"] == "PENDING"


def test_create_with_multiple_images(users, create_property):
    prop = create_property(users["h"]["owner"], images=3)
    assert len(prop["images"]) == 3
    assert all(i["status"] == "PENDING" for i in prop["images"])
    assert prop["image"] is None
    assert len(uploads()) == 3


def test_invalid_image_type(client, users, create_property):
    prop = create_property(users["h"]["owner"])
    r = client.post(f"/api/v1/properties/{prop['id']}/images", data={"images": [image("x.gif")]},
                    headers=users["h"]["owner"], content_type="multipart/form-data")
    assert r.status_code == 400


def test_max_ten_images(client, users, create_property):
    prop = create_property(users["h"]["owner"], images=8)
    r = client.post(f"/api/v1/properties/{prop['id']}/images",
                    data={"images": [image(f"{i}.jpg") for i in range(3)]},
                    headers=users["h"]["owner"], content_type="multipart/form-data")
    assert r.status_code == 400


def test_set_cover_and_delete_image(client, users, create_property, approve_images):
    h = users["h"]["owner"]
    prop = create_property(h, images=3)
    ids = [i["id"] for i in prop["images"]]
    approve_images(users["h"]["admin"])

    r = client.patch(f"/api/v1/properties/{prop['id']}/images/{ids[2]}/cover", headers=h)
    assert [i["id"] for i in r.get_json()["images"]] == [ids[2], ids[0], ids[1]]

    r = client.delete(f"/api/v1/properties/{prop['id']}/images/{ids[2]}", headers=h)
    body = r.get_json()
    assert [i["id"] for i in body["images"]] == [ids[0], ids[1]]
    assert body["image"] == body["images"][0]["path"]
    assert len(uploads()) == 2


def test_other_owner_cannot_touch_images(client, users, create_property):
    prop = create_property(users["h"]["owner"], images=1)
    r = client.post(f"/api/v1/properties/{prop['id']}/images", data={"images": [image()]},
                    headers=users["h"]["owner2"], content_type="multipart/form-data")
    assert r.status_code in (400, 403)


def test_update_property(client, users, create_property):
    prop = create_property(users["h"]["owner"])
    r = client.put(f"/api/v1/properties/{prop['id']}", json={"price": 900, "status": "APPROVED"},
                   headers=users["h"]["owner"])
    assert r.status_code == 200
    assert r.get_json()["price"] == 900
    assert r.get_json()["status"] == "PENDING"


def test_update_to_duplicate_address_conflicts(client, users, create_property):
    h = users["h"]["owner"]
    create_property(h, address="Main 1")
    other = create_property(h, address="Main 2")
    r = client.put(f"/api/v1/properties/{other['id']}", json={"address": "Main 1"}, headers=h)
    assert r.status_code == 409


def test_pending_property_visibility(client, users, create_property):
    prop = create_property(users["h"]["owner"])
    url = f"/api/v1/properties/{prop['id']}"
    assert client.get(url, headers=users["h"]["owner"]).status_code == 200
    assert client.get(url, headers=users["h"]["admin"]).status_code == 200
    assert client.get(url, headers=users["h"]["owner2"]).status_code == 404
    assert client.get(url, headers=users["h"]["tenant"]).status_code == 404
    assert client.get(f"/api/v1/properties/public/{prop['id']}").status_code == 404


def test_search(client, users, create_property, approve):
    h, a = users["h"]["owner"], users["h"]["admin"]
    cheap = create_property(h, address="Ermou 1", price="500")
    pricey = create_property(h, address="Stadiou 2", price="1500")
    approve(cheap["id"], h, a)
    approve(pricey["id"], h, a)

    ids = lambda r: [p["id"] for p in r.get_json()]
    assert ids(client.get("/api/v1/properties/approved?q=ermou")) == [cheap["id"]]
    assert ids(client.get("/api/v1/properties/approved?max_price=1000")) == [cheap["id"]]
    assert ids(client.get("/api/v1/properties/approved?sort=price_desc")) == [pricey["id"], cheap["id"]]
    assert client.get("/api/v1/properties/approved?min_price=abc").status_code == 400


def test_delete_property_removes_files(client, users, create_property):
    prop = create_property(users["h"]["owner"], images=2)
    assert client.delete(f"/api/v1/properties/{prop['id']}", headers=users["h"]["owner2"]).status_code in (400, 403)
    assert client.delete(f"/api/v1/properties/{prop['id']}", headers=users["h"]["owner"]).status_code == 200
    assert uploads() == []
