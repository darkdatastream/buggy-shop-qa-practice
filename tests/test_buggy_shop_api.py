import os

import pytest
import requests


BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:8787").rstrip("/")
TIMEOUT_SECONDS = 10


def api_get(path: str) -> requests.Response:
    return requests.get(f"{BASE_URL}{path}", timeout=TIMEOUT_SECONDS)


def api_post(path: str, payload: dict) -> requests.Response:
    return requests.post(f"{BASE_URL}{path}", json=payload, timeout=TIMEOUT_SECONDS)


def test_health_returns_ok():
    response = api_get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_products_list_returns_array():
    response = api_get("/api/products")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.xfail(reason="Known bug BUG-001: product 2 price is string instead of number")
def test_all_products_have_numeric_price():
    response = api_get("/api/products")
    products = response.json()

    assert response.status_code == 200
    for product in products:
        assert isinstance(product["price"], (int, float)), product


def test_existing_product_returns_correct_id():
    response = api_get("/api/products/1")

    assert response.status_code == 200
    assert response.json()["id"] == 1


@pytest.mark.xfail(reason="Known bug BUG-002: missing product returns 200 instead of 404")
def test_missing_product_returns_404():
    response = api_get("/api/products/999")

    assert response.status_code == 404


def test_valid_login_returns_token():
    response = api_post(
        "/api/login",
        {"email": "qa@example.com", "password": "correct-password"},
    )

    assert response.status_code == 200
    assert response.json()["token"] == "demo-token-user"


@pytest.mark.xfail(reason="Known bug BUG-003: invalid login returns 200 instead of 401")
def test_invalid_login_returns_401():
    response = api_post(
        "/api/login",
        {"email": "qa@example.com", "password": "wrong-password"},
    )

    assert response.status_code == 401


def test_create_order_with_valid_product_id_returns_201():
    response = api_post("/api/orders", {"product_id": 1, "quantity": 1})

    assert response.status_code == 201
    assert response.json()["product_id"] == 1


@pytest.mark.xfail(reason="Known bug BUG-004: order without product_id returns 201 instead of 400")
def test_create_order_without_product_id_returns_400():
    response = api_post("/api/orders", {"quantity": 1})

    assert response.status_code == 400
