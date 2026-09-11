import pytest

from app import app
from models import db


@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

    with app.app_context():
        db.drop_all()
        db.create_all()

        with app.test_client() as client:
            yield client

        db.session.remove()
        db.drop_all()


def create_driver_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test Driver",
            "email": "driver@test.com",
            "password": "password123",
            "role": "driver"
        }
    )

    return response


def create_driver_profile(client):
    create_driver_user(client)

    response = client.post(
        "/api/drivers/",
        json={
            "user_id": 1,
            "phone": "0712345678",
            "license_number": "DL123456"
        }
    )

    return response


def create_customer_and_trip(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Test Customer",
            "email": "customer@test.com",
            "password": "password123",
            "role": "customer"
        }
    )

    response = client.post(
        "/api/trips/",
        json={
            "customer_id": 1,
            "pickup_location": "Westlands",
            "delivery_location": "Kilimani",
            "package_description": "Small package"
        }
    )

    return response


def test_create_driver_profile(client):
    create_driver_user(client)

    response = client.post(
        "/api/drivers/",
        json={
            "user_id": 1,
            "phone": "0712345678",
            "license_number": "DL123456"
        }
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["message"] == "Driver profile created successfully"
    assert data["driver"]["user_id"] == 1
    assert data["driver"]["phone"] == "0712345678"
    assert data["driver"]["license_number"] == "DL123456"
    assert data["driver"]["is_available"] is True


def test_get_driver_by_user(client):
    create_driver_profile(client)

    response = client.get(
        "/api/drivers/user/1"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["user_id"] == 1
    assert data["phone"] == "0712345678"
    assert data["license_number"] == "DL123456"


def test_driver_profile_not_found(client):
    create_driver_user(client)

    response = client.get(
        "/api/drivers/user/1"
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["error"] == "Driver profile not found"


def test_create_driver_for_non_driver_user(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Customer",
            "email": "customer@test.com",
            "password": "password123",
            "role": "customer"
        }
    )

    response = client.post(
        "/api/drivers/",
        json={
            "user_id": 1,
            "phone": "0712345678",
            "license_number": "DL123456"
        }
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["error"] == "User is not registered as a driver"


def test_create_driver_user_not_found(client):
    response = client.post(
        "/api/drivers/",
        json={
            "user_id": 999,
            "phone": "0712345678",
            "license_number": "DL123456"
        }
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["error"] == "User not found"


def test_duplicate_driver_profile(client):
    create_driver_profile(client)

    response = client.post(
        "/api/drivers/",
        json={
            "user_id": 1,
            "phone": "0799999999",
            "license_number": "DL999999"
        }
    )

    assert response.status_code == 409

    data = response.get_json()

    assert data["error"] == "Driver profile already exists"


def test_update_driver_availability(client):
    create_driver_profile(client)

    response = client.patch(
        "/api/drivers/1/availability",
        json={
            "is_available": False
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["driver_id"] == 1
    assert data["is_available"] is False


def test_update_driver_availability_missing_field(client):
    create_driver_profile(client)

    response = client.patch(
        "/api/drivers/1/availability",
        json={}
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["error"] == "is_available is required"


def test_update_unknown_driver_availability(client):
    response = client.patch(
        "/api/drivers/999/availability",
        json={
            "is_available": False
        }
    )

    assert response.status_code == 404


def test_get_available_trips(client):
    create_driver_profile(client)
    create_customer_and_trip(client)

    response = client.get(
        "/api/drivers/1/available-trips"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert len(data) == 1
    assert data[0]["pickup_location"] == "Westlands"
    assert data[0]["delivery_location"] == "Kilimani"
    assert data[0]["status"] == "pending"


def test_get_driver_trips(client):
    create_driver_profile(client)

    response = client.get(
        "/api/drivers/1/trips"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data == []


def test_unknown_driver_available_trips(client):
    response = client.get(
        "/api/drivers/999/available-trips"
    )

    assert response.status_code == 404


def test_unknown_driver_trips(client):
    response = client.get(
        "/api/drivers/999/trips"
    )

    assert response.status_code == 404