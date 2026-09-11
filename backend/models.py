from datetime import datetime

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


# ==================================================
# USER
# ==================================================

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        nullable=False,
        default="customer"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    driver = db.relationship(
        "Driver",
        backref="user",
        uselist=False,
        cascade="all, delete-orphan"
    )


# ==================================================
# DRIVER
# ==================================================

class Driver(db.Model):
    __tablename__ = "drivers"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    phone = db.Column(
        db.String(20),
        nullable=False
    )

    license_number = db.Column(
        db.String(100),
        nullable=False
    )

    is_available = db.Column(
        db.Boolean,
        default=True
    )

    vehicles = db.relationship(
        "Vehicle",
        backref="driver",
        lazy=True,
        cascade="all, delete-orphan"
    )


# ==================================================
# VEHICLE
# ==================================================

class Vehicle(db.Model):
    __tablename__ = "vehicles"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    driver_id = db.Column(
        db.Integer,
        db.ForeignKey("drivers.id"),
        nullable=False
    )

    vehicle_type = db.Column(
        db.String(50),
        nullable=False
    )

    registration_number = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    model = db.Column(
        db.String(100)
    )

    capacity = db.Column(
        db.Float
    )

    is_available = db.Column(
        db.Boolean,
        default=True
    )


# ==================================================
# DELIVERY / TRIP
# ==================================================

class Delivery(db.Model):
    __tablename__ = "deliveries"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    customer_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    driver_id = db.Column(
        db.Integer,
        db.ForeignKey("drivers.id"),
        nullable=True
    )

    pickup_location = db.Column(
        db.String(255),
        nullable=False
    )

    delivery_location = db.Column(
        db.String(255),
        nullable=False
    )

    package_description = db.Column(
        db.String(255),
        nullable=False
    )

    status = db.Column(
        db.String(30),
        default="pending"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )