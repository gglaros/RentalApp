def test_security_headers_on_api(client):
    r = client.get("/api/v1/properties/approved")
    assert r.headers["X-Content-Type-Options"] == "nosniff"
    assert r.headers["X-Frame-Options"] == "DENY"
    assert "frame-ancestors 'none'" in r.headers["Content-Security-Policy"]
    assert r.headers["Referrer-Policy"] == "no-referrer"


def test_security_headers_on_errors(client):
    r = client.get("/api/v1/users/me")
    assert r.status_code == 401
    assert r.headers["X-Content-Type-Options"] == "nosniff"


def test_no_hsts_outside_production(client):
    r = client.get("/api/v1/properties/approved")
    assert "Strict-Transport-Security" not in r.headers