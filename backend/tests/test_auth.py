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


def test_register_customer(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test Customer",
            "email": "customer@test.com",
            "password": "password123",
            "role": "customer"
        }
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["message"] == "Registration successful"
    assert data["user"]["name"] == "Test Customer"
    assert data["user"]["email"] == "customer@test.com"
    assert data["user"]["role"] == "customer"


def test_register_driver(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test Driver",
            "email": "driver@test.com",
            "password": "password123",
            "role": "driver"
        }
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["user"]["role"] == "driver"


def test_register_duplicate_email(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "First User",
            "email": "duplicate@test.com",
            "password": "password123"
        }
    )

    response = client.post(
        "/api/auth/register",
        json={
            "name": "Second User",
            "email": "duplicate@test.com",
            "password": "password123"
        }
    )

    assert response.status_code == 409

    data = response.get_json()

    assert data["error"] == "Email already registered"


def test_register_missing_field(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@test.com"
        }
    )

    assert response.status_code == 400


def test_login_success(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Login User",
            "email": "login@test.com",
            "password": "password123"
        }
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "login@test.com",
            "password": "password123"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Login successful"
    assert data["user"]["email"] == "login@test.com"


def test_login_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Login User",
            "email": "wrongpassword@test.com",
            "password": "password123"
        }
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "wrongpassword@test.com",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401

    data = response.get_json()

    assert data["error"] == "Invalid email or password"


def test_login_unknown_user(client):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "unknown@test.com",
            "password": "password123"
        }
    )

    assert response.status_code == 401