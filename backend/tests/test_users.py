import pytest

from app import app
from models import db, User


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


def create_test_user(client):
    response = client.post(
        "/api/users/",
        json={
            "name": "Test User",
            "email": "user@test.com",
            "password": "password123",
            "role": "customer"
        }
    )

    return response


def test_get_users_empty(client):
    response = client.get("/api/users/")

    assert response.status_code == 200

    data = response.get_json()

    assert data == []


def test_create_user(client):
    response = create_test_user(client)

    assert response.status_code == 201

    data = response.get_json()

    assert data["message"] == "User created successfully"
    assert data["user"]["name"] == "Test User"
    assert data["user"]["email"] == "user@test.com"
    assert data["user"]["role"] == "customer"


def test_get_users(client):
    create_test_user(client)

    response = client.get("/api/users/")

    assert response.status_code == 200

    data = response.get_json()

    assert len(data) == 1
    assert data[0]["name"] == "Test User"
    assert data[0]["email"] == "user@test.com"


def test_get_one_user(client):
    create_test_user(client)

    response = client.get("/api/users/1")

    assert response.status_code == 200

    data = response.get_json()

    assert data["id"] == 1
    assert data["name"] == "Test User"
    assert data["email"] == "user@test.com"


def test_get_user_not_found(client):
    response = client.get("/api/users/999")

    assert response.status_code == 404

    data = response.get_json()

    assert data["error"] == "User not found"


def test_create_user_missing_field(client):
    response = client.post(
        "/api/users/",
        json={
            "name": "Incomplete User",
            "email": "incomplete@test.com"
        }
    )

    assert response.status_code == 400


def test_create_duplicate_user(client):
    create_test_user(client)

    response = client.post(
        "/api/users/",
        json={
            "name": "Another User",
            "email": "user@test.com",
            "password": "password456",
            "role": "customer"
        }
    )

    assert response.status_code == 409

    data = response.get_json()

    assert data["error"] == "Email already registered"


def test_update_user(client):
    create_test_user(client)

    response = client.patch(
        "/api/users/1",
        json={
            "name": "Updated User",
            "email": "updated@test.com"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "User updated successfully"
    assert data["user"]["name"] == "Updated User"
    assert data["user"]["email"] == "updated@test.com"


def test_update_user_not_found(client):
    response = client.patch(
        "/api/users/999",
        json={
            "name": "Updated User"
        }
    )

    assert response.status_code == 404


def test_update_invalid_role(client):
    create_test_user(client)

    response = client.patch(
        "/api/users/1",
        json={
            "role": "admin"
        }
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["error"] == "Invalid role"


def test_delete_user(client):
    create_test_user(client)

    response = client.delete("/api/users/1")

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "User deleted successfully"

    response = client.get("/api/users/1")

    assert response.status_code == 404
    