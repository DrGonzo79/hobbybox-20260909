from fastapi.testclient import TestClient
import pytest

from main import app

client = TestClient(app)
BASE = {"kit_id": "first-mix", "days": 5, "protection": True, "delivery": "pickup"}


def test_quote_calculates_price_and_lower_protected_hold():
    response = client.post("/rentals/quote", json=BASE)
    assert response.status_code == 200
    result = response.json()
    assert result["rental"] == 135
    assert result["protection"] == 16
    assert result["dueToday"] == 151
    assert result["refundableHold"] == 78
    assert result["returnDay"] == 6


def test_week_rate_and_shipping_are_applied():
    result = client.post("/rentals/quote", json={**BASE, "days": 7, "delivery": "shipped"}).json()
    assert result["rental"] == 189
    assert result["discount"] == 28
    assert result["delivery"] == 24
    assert result["dueToday"] == 204


def test_unavailable_inventory_has_named_conflict():
    response = client.post("/rentals/quote", json={**BASE, "days": 11})
    assert response.status_code == 409
    assert response.json()["detail"] == {"code": "inventory_window_unavailable", "availableDays": 10}


def test_unknown_kit_is_not_found():
    response = client.post("/rentals/quote", json={**BASE, "kit_id": "missing"})
    assert response.status_code == 404
    assert response.json()["detail"] == "kit_not_found"


@pytest.mark.parametrize("field,value", [
    ("kit_id", ""), ("days", 1), ("days", 22), ("days", True),
    ("protection", "yes"), ("delivery", "drone"),
])
def test_invalid_inputs_are_rejected(field, value):
    assert client.post("/rentals/quote", json={**BASE, field: value}).status_code == 422


def test_declining_protection_raises_hold_without_fake_fee():
    result = client.post("/rentals/quote", json={**BASE, "protection": False}).json()
    assert result["protection"] == 0
    assert result["refundableHold"] == 195


def test_catalog_and_health_share_demo_fixture():
    assert len(client.get("/kits").json()) == 4
    assert client.get("/health").json() == {"status": "ok", "mode": "demo", "inventory": "fixture"}
