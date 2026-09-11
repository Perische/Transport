from flask import Blueprint, jsonify, request

from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from models import db, Driver, User, Delivery, Vehicle


driver_bp = Blueprint(
    "drivers",
    __name__,
    url_prefix="/api/drivers"
)


# ==================================================
# HELPERS
# ==================================================

def get_current_user():

    user_id = get_jwt_identity()

    try:
        user_id = int(user_id)

    except (TypeError, ValueError):
        return None

    return User.query.get(user_id)


def get_current_driver():

    current_user = get_current_user()

    if not current_user:
        return None

    return Driver.query.filter_by(
        user_id=current_user.id
    ).first()


# ==================================================
# GET DRIVER BY USER
# ==================================================

@driver_bp.route(
    "/user/<int:user_id>",
    methods=["GET"]
)
@jwt_required()
def get_driver_by_user(user_id):

    current_user = get_current_user()

    if not current_user:
        return jsonify({
            "error":
                "User account not found."
        }), 404

    if current_user.id != user_id:
        return jsonify({
            "error":
                "You are not authorized to view this driver profile."
        }), 403

    driver = Driver.query.filter_by(
        user_id=user_id
    ).first()

    if not driver:
        return jsonify({
            "error":
                "Driver profile not found."
        }), 404

    return jsonify({
        "driver": {
            "id": driver.id,
            "user_id": driver.user_id,
            "phone": driver.phone,
            "license_number":
                driver.license_number,
            "is_available":
                driver.is_available,
        }
    }), 200


# ==================================================
# CREATE DRIVER PROFILE
# ==================================================

@driver_bp.route(
    "/",
    methods=["POST"]
)
@jwt_required()
def create_driver():

    current_user = get_current_user()

    if not current_user:
        return jsonify({
            "error":
                "User account not found."
        }), 404

    if current_user.role != "driver":
        return jsonify({
            "error":
                "Only driver accounts can create a driver profile."
        }), 403

    existing_driver = Driver.query.filter_by(
        user_id=current_user.id
    ).first()

    if existing_driver:
        return jsonify({
            "error":
                "Driver profile already exists."
        }), 409

    data = request.get_json()

    if not data:
        return jsonify({
            "error":
                "Request body is required."
        }), 400

    phone = data.get("phone")

    license_number = data.get(
        "license_number"
    )

    if not phone:
        return jsonify({
            "error":
                "Phone number is required."
        }), 400

    if not license_number:
        return jsonify({
            "error":
                "Driver's licence number is required."
        }), 400

    driver = Driver(
        user_id=current_user.id,
        phone=str(phone).strip(),
        license_number=str(
            license_number
        ).strip(),
        is_available=True
    )

    db.session.add(driver)
    db.session.commit()

    return jsonify({
        "message":
            "Driver profile created successfully.",

        "driver": {
            "id": driver.id,

            "user_id":
                driver.user_id,

            "phone":
                driver.phone,

            "license_number":
                driver.license_number,

            "is_available":
                driver.is_available,
        }
    }), 201


# ==================================================
# UPDATE DRIVER AVAILABILITY
# ==================================================

@driver_bp.route(
    "/<int:driver_id>/availability",
    methods=["PATCH"]
)
@jwt_required()
def update_driver_availability(
    driver_id
):

    current_driver = get_current_driver()

    if not current_driver:
        return jsonify({
            "error":
                "Driver profile not found."
        }), 404

    if current_driver.id != driver_id:
        return jsonify({
            "error":
                "You are not authorized to update this driver."
        }), 403

    data = request.get_json()

    if not data:
        return jsonify({
            "error":
                "Request body is required."
        }), 400

    if "is_available" not in data:
        return jsonify({
            "error":
                "is_available is required."
        }), 400

    is_available = data[
        "is_available"
    ]

    if not isinstance(
        is_available,
        bool
    ):
        return jsonify({
            "error":
                "is_available must be true or false."
        }), 400

    # ==============================================
    # VEHICLE REQUIREMENT
    # ==============================================

    if is_available:

        available_vehicle = Vehicle.query.filter_by(
            driver_id=current_driver.id,
            is_available=True
        ).first()

        if not available_vehicle:
            return jsonify({
                "error":
                    "You need at least one available vehicle before going online."
            }), 400

    current_driver.is_available = (
        is_available
    )

    db.session.commit()

    return jsonify({
        "message":
            "Driver availability updated successfully.",

        "driver": {
            "id":
                current_driver.id,

            "user_id":
                current_driver.user_id,

            "phone":
                current_driver.phone,

            "license_number":
                current_driver.license_number,

            "is_available":
                current_driver.is_available,
        }
    }), 200


# ==================================================
# GET DRIVER TRIPS
# ==================================================

@driver_bp.route(
    "/<int:driver_id>/trips",
    methods=["GET"]
)
@jwt_required()
def get_driver_trips(
    driver_id
):

    current_driver = get_current_driver()

    if not current_driver:
        return jsonify({
            "error":
                "Driver profile not found."
        }), 404

    if current_driver.id != driver_id:
        return jsonify({
            "error":
                "You are not authorized to view these trips."
        }), 403

    trips = Delivery.query.filter_by(
        driver_id=driver_id
    ).order_by(
        Delivery.created_at.desc()
    ).all()

    return jsonify([
        {
            "id": trip.id,

            "customer_id":
                trip.customer_id,

            "driver_id":
                trip.driver_id,

            "pickup_location":
                trip.pickup_location,

            "delivery_location":
                trip.delivery_location,

            "package_description":
                trip.package_description,

            "status":
                trip.status,

            "created_at": (
                trip.created_at.isoformat()
                if trip.created_at
                else None
            )
        }

        for trip in trips

    ]), 200


# ==================================================
# GET AVAILABLE DELIVERIES
# ==================================================

@driver_bp.route(
    "/available-trips",
    methods=["GET"]
)
@jwt_required()
def get_available_trips():

    current_driver = get_current_driver()

    if not current_driver:
        return jsonify({
            "error":
                "Driver profile not found."
        }), 404

    if not current_driver.is_available:
        return jsonify({
            "error":
                "You must be available to view delivery requests."
        }), 403

    available_vehicle = Vehicle.query.filter_by(
        driver_id=current_driver.id,
        is_available=True
    ).first()

    if not available_vehicle:
        return jsonify({
            "error":
                "You need an available vehicle to view delivery requests."
        }), 403

    trips = Delivery.query.filter_by(
        status="pending"
    ).order_by(
        Delivery.created_at.desc()
    ).all()

    return jsonify([
        {
            "id": trip.id,

            "customer_id":
                trip.customer_id,

            "driver_id":
                trip.driver_id,

            "pickup_location":
                trip.pickup_location,

            "delivery_location":
                trip.delivery_location,

            "package_description":
                trip.package_description,

            "status":
                trip.status,

            "created_at": (
                trip.created_at.isoformat()
                if trip.created_at
                else None
            )
        }

        for trip in trips

    ]), 200