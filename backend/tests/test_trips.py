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


def create_customer(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test Customer",
            "email": "customer@test.com",
            "password": "password123",
            "role": "customer"
        }
    )

    return response


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
            "user_id": 2,
            "phone": "0712345678",
            "license_number": "DL123456"
        }
    )

    return response


def create_trip(client):
    create_customer(client)

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


def test_get_trips_empty(client):
    response = client.get("/api/trips/")

    assert response.status_code == 200

    data = response.get_json()

    assert data == []


def test_create_trip(client):
    response = create_trip(client)

    assert response.status_code == 201

    data = response.get_json()

    assert data["message"] == "Trip created successfully"
    assert data["trip"]["customer_id"] == 1
    assert data["trip"]["pickup_location"] == "Westlands"
    assert data["trip"]["delivery_location"] == "Kilimani"
    assert data["trip"]["package_description"] == "Small package"
    assert data["trip"]["status"] == "pending"


def test_create_trip_missing_field(client):
    create_customer(client)

    response = client.post(
        "/api/trips/",
        json={
            "customer_id": 1,
            "pickup_location": "Westlands"
        }
    )

    assert response.status_code == 400


def test_get_all_trips(client):
    create_trip(client)

    response = client.get("/api/trips/")

    assert response.status_code == 200

    data = response.get_json()

    assert len(data) == 1
    assert data[0]["pickup_location"] == "Westlands"
    assert data[0]["delivery_location"] == "Kilimani"
    assert data[0]["status"] == "pending"


def test_get_one_trip(client):
    create_trip(client)

    response = client.get("/api/trips/1")

    assert response.status_code == 200

    data = response.get_json()

    assert data["id"] == 1
    assert data["customer_id"] == 1
    assert data["pickup_location"] == "Westlands"
    assert data["delivery_location"] == "Kilimani"


def test_get_trip_not_found(client):
    response = client.get("/api/trips/999")

    assert response.status_code == 404

    data = response.get_json()

    assert data["error"] == "Trip not found"


def test_assign_driver(client):
    create_trip(client)
    create_driver(client)

    response = client.patch(
        "/api/trips/1/assign",
        json={
            "driver_id": 1
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Driver assigned successfully"
    assert data["trip_id"] == 1
    assert data["driver_id"] == 1
    assert data["status"] == "assigned"


def test_assign_unknown_driver(client):
    create_trip(client)

    response = client.patch(
        "/api/trips/1/assign",
        json={
            "driver_id": 999
        }
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["error"] == "Driver not found"


def test_assign_driver_missing_driver_id(client):
    create_trip(client)

    response = client.patch(
        "/api/trips/1/assign",
        json={}
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["error"] == "driver_id is required"


def test_assign_unavailable_driver(client):
    create_trip(client)
    create_driver(client)

    client.patch(
        "/api/drivers/1/availability",
        json={
            "is_available": False
        }
    )

    response = client.patch(
        "/api/trips/1/assign",
        json={
            "driver_id": 1
        }
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["error"] == "Driver is not available"


def test_trip_cannot_have_two_drivers(client):
    create_trip(client)
    create_driver(client)

    client.patch(
        "/api/trips/1/assign",
        json={
            "driver_id": 1
        }
    )

    response = client.patch(
        "/api/trips/1/assign",
        json={
            "driver_id": 1
        }
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["error"] == "Trip already has a driver"


def test_update_trip_status(client):
    create_trip(client)
    create_driver(client)

    client.patch(
        "/api/trips/1/assign",
        json={
            "driver_id": 1
        }
    )

    response = client.patch(
        "/api/trips/1/status",
        json={
            "status": "picked_up"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Trip status updated"
    assert data["trip_id"] == 1
    assert data["status"] == "picked_up"


def test_invalid_trip_status(client):
    create_trip(client)

    response = client.patch(
        "/api/trips/1/status",
        json={
            "status": "flying"
        }
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["error"] == "Invalid trip status"


def test_complete_delivery_flow(client):
    create_trip(client)
    create_driver(client)

    # Assign driver
    response = client.patch(
        "/api/trips/1/assign",
        json={
            "driver_id": 1
        }
    )

    assert response.status_code == 200

    # Pick up package
    response = client.patch(
        "/api/trips/1/status",
        json={
            "status": "picked_up"
        }
    )

    assert response.status_code == 200

    # Start delivery
    response = client.patch(
        "/api/trips/1/status",
        json={
            "status": "in_transit"
        }
    )

    assert response.status_code == 200

    # Complete delivery
    response = client.patch(
        "/api/trips/1/status",
        json={
            "status": "delivered"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["status"] == "delivered"


def test_driver_becomes_available_after_delivery(client):
    create_trip(client)
    create_driver(client)

    client.patch(
        "/api/trips/1/assign",
        json={
            "driver_id": 1
        }
    )

    response = client.patch(
        "/api/trips/1/status",
        json={
            "status": "delivered"
        }
    )

    assert response.status_code == 200

    driver_response = client.get(
        "/api/drivers/user/2"
    )

    assert driver_response.status_code == 200

    driver_data = driver_response.get_json()

    assert driver_data["is_available"] is True


def test_cancelled_trip_makes_driver_available(client):
    create_trip(client)
    create_driver(client)

    client.patch(
        "/api/trips/1/assign",
        json={
            "driver_id": 1
        }
    )

    response = client.patch(
        "/api/trips/1/status",
        json={
            "status": "cancelled"
        }
    )

    assert response.status_code == 200

    driver_response = client.get(
        "/api/drivers/user/2"
    )

    driver_data = driver_response.get_json()

    assert driver_data["is_available"] is True