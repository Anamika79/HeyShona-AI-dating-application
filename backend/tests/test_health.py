from datetime import datetime
from fastapi.testclient import TestClient


def test_root_endpoint(client: TestClient):
    """Verifies root discovery endpoint returns valid service metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "service" in data
    assert "version" in data
    assert data["health"] == "/api/v1/health"
    assert data["docs"] == "/api/v1/docs"


def test_health_check_endpoint(client: TestClient):
    """Verifies /api/v1/health returns healthy status and active DB ping."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "healthy"
    assert data["service"] == "AI Dating Platform API"
    assert data["environment"] == "development"
    assert "version" in data

    # Database health verification
    db_health = data["database"]
    assert db_health["connected"] is True
    assert db_health["dialect"] == "sqlite"
    assert db_health["error"] is None

    # Timestamp verification
    timestamp_str = data["timestamp"]
    parsed_time = datetime.fromisoformat(timestamp_str)
    assert parsed_time is not None


def test_not_found_standardized_envelope(client: TestClient):
    """Verifies that non-existent routes return our standardized error envelope."""
    response = client.get("/api/v1/does-not-exist")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "HTTP_404"
    assert "Not Found" in data["error"]["message"]


def test_cors_headers(client: TestClient):
    """Verifies CORS headers allow configured frontend origin."""
    response = client.get(
        "/api/v1/health",
        headers={"Origin": "http://localhost:5173"},
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
