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


def create_driver(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Test Driver",
            "email": "driver@test.com",
            "password": "password123",
            "role": "driver"
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

    return response


def create_vehicle(client):
    create_driver(client)

    response = client.post(
        "/api/vehicles/",
        json={
            "driver_id": 1,
            "vehicle_type": "Van",
            "registration_number": "KDA 123A",
            "model": "Toyota Hiace",
            "capacity": 1000
        }
    )

    return response


def test_create_vehicle(client):
    response = create_vehicle(client)

    assert response.status_code == 201

    data = response.get_json()

    assert data["message"] == "Vehicle created successfully"
    assert data["vehicle"]["driver_id"] == 1
    assert data["vehicle"]["vehicle_type"] == "Van"
    assert data["vehicle"]["registration_number"] == "KDA 123A"
    assert data["vehicle"]["model"] == "Toyota Hiace"
    assert data["vehicle"]["capacity"] == 1000
    assert data["vehicle"]["is_available"] is True


def test_get_driver_vehicles(client):
    create_vehicle(client)

    response = client.get(
        "/api/vehicles/driver/1"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert len(data) == 1
    assert data[0]["vehicle_type"] == "Van"
    assert data[0]["registration_number"] == "KDA 123A"


def test_get_driver_vehicles_empty(client):
    create_driver(client)

    response = client.get(
        "/api/vehicles/driver/1"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data == []


def test_get_vehicles_unknown_driver(client):
    response = client.get(
        "/api/vehicles/driver/999"
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["error"] == "Driver not found"


def test_create_vehicle_unknown_driver(client):
    response = client.post(
        "/api/vehicles/",
        json={
            "driver_id": 999,
            "vehicle_type": "Van",
            "registration_number": "KDA 999Z"
        }
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["error"] == "Driver not found"


def test_create_vehicle_missing_field(client):
    create_driver(client)

    response = client.post(
        "/api/vehicles/",
        json={
            "driver_id": 1,
            "vehicle_type": "Van"
        }
    )

    assert response.status_code == 400


def test_duplicate_vehicle_registration(client):
    create_vehicle(client)

    response = client.post(
        "/api/vehicles/",
        json={
            "driver_id": 1,
            "vehicle_type": "Truck",
            "registration_number": "KDA 123A",
            "model": "Isuzu",
            "capacity": 5000
        }
    )

    assert response.status_code == 409

    data = response.get_json()

    assert data["error"] == "Vehicle registration already exists"


def test_update_vehicle(client):
    create_vehicle(client)

    response = client.patch(
        "/api/vehicles/1",
        json={
            "vehicle_type": "Truck",
            "model": "Isuzu NQR",
            "capacity": 5000,
            "is_available": False
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Vehicle updated successfully"
    assert data["vehicle"]["vehicle_type"] == "Truck"
    assert data["vehicle"]["model"] == "Isuzu NQR"
    assert data["vehicle"]["capacity"] == 5000
    assert data["vehicle"]["is_available"] is False


def test_update_unknown_vehicle(client):
    response = client.patch(
        "/api/vehicles/999",
        json={
            "model": "Toyota"
        }
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["error"] == "Vehicle not found"


def test_delete_vehicle(client):
    create_vehicle(client)

    response = client.delete(
        "/api/vehicles/1"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Vehicle deleted successfully"


def test_delete_unknown_vehicle(client):
    response = client.delete(
        "/api/vehicles/999"
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["error"] == "Vehicle not found"