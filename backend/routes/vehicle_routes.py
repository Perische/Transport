from flask import Blueprint, jsonify, request

from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from models import db, Driver, User, Vehicle


vehicle_bp = Blueprint(
    "vehicles",
    __name__,
    url_prefix="/api/vehicles"
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


def vehicle_belongs_to_driver(
    vehicle,
    driver
):

    if not vehicle or not driver:
        return False

    return vehicle.driver_id == driver.id


# ==================================================
# GET DRIVER VEHICLES
# ==================================================

@vehicle_bp.route(
    "/driver/<int:driver_id>",
    methods=["GET"]
)
@jwt_required()
def get_driver_vehicles(
    driver_id
):

    current_driver = (
        get_current_driver()
    )


    if not current_driver:

        return jsonify({
            "error":
                "Driver profile not found."
        }), 404


    # ==============================================
    # OWNERSHIP CHECK
    # ==============================================

    if current_driver.id != driver_id:

        return jsonify({
            "error":
                "You are not authorized to view these vehicles."
        }), 403


    vehicles = Vehicle.query.filter_by(
        driver_id=driver_id
    ).order_by(
        Vehicle.id.desc()
    ).all()


    return jsonify({

        "vehicles": [

            {
                "id":
                    vehicle.id,

                "driver_id":
                    vehicle.driver_id,

                "vehicle_type":
                    vehicle.vehicle_type,

                "registration_number":
                    vehicle.registration_number,

                "model":
                    vehicle.model,

                "capacity":
                    vehicle.capacity,

                "is_available":
                    vehicle.is_available,

            }

            for vehicle in vehicles

        ]

    }), 200


# ==================================================
# CREATE VEHICLE
# ==================================================

@vehicle_bp.route(
    "/",
    methods=["POST"]
)
@jwt_required()
def create_vehicle():

    current_driver = (
        get_current_driver()
    )


    if not current_driver:

        return jsonify({
            "error":
                "Driver profile not found."
        }), 404


    data = request.get_json()


    if not data:

        return jsonify({
            "error":
                "Request body is required."
        }), 400


    vehicle_type = data.get(
        "vehicle_type"
    )

    registration_number = data.get(
        "registration_number"
    )

    model = data.get(
        "model"
    )

    capacity = data.get(
        "capacity"
    )


    if not vehicle_type:

        return jsonify({
            "error":
                "Vehicle type is required."
        }), 400


    if not registration_number:

        return jsonify({
            "error":
                "Registration number is required."
        }), 400


    vehicle_type = str(
        vehicle_type
    ).strip()


    registration_number = str(
        registration_number
    ).strip().upper()


    if not vehicle_type:

        return jsonify({
            "error":
                "Vehicle type cannot be empty."
        }), 400


    if not registration_number:

        return jsonify({
            "error":
                "Registration number cannot be empty."
        }), 400


    # ==============================================
    # CHECK REGISTRATION
    # ==============================================

    existing_vehicle = (
        Vehicle.query.filter_by(
            registration_number=
                registration_number
        ).first()
    )


    if existing_vehicle:

        return jsonify({
            "error":
                "A vehicle with this registration number already exists."
        }), 409


    # ==============================================
    # VALIDATE CAPACITY
    # ==============================================

    parsed_capacity = None


    if capacity is not None and capacity != "":

        try:

            parsed_capacity = float(
                capacity
            )

        except (
            TypeError,
            ValueError
        ):

            return jsonify({
                "error":
                    "Capacity must be a valid number."
            }), 400


        if parsed_capacity <= 0:

            return jsonify({
                "error":
                    "Capacity must be greater than zero."
            }), 400


    # ==============================================
    # CREATE VEHICLE
    # ==============================================

    vehicle = Vehicle(

        driver_id=
            current_driver.id,

        vehicle_type=
            vehicle_type,

        registration_number=
            registration_number,

        model=(
            str(model).strip()
            if model
            else None
        ),

        capacity=
            parsed_capacity,

        is_available=True

    )


    db.session.add(vehicle)

    db.session.commit()


    return jsonify({

        "message":
            "Vehicle created successfully.",

        "vehicle": {

            "id":
                vehicle.id,

            "driver_id":
                vehicle.driver_id,

            "vehicle_type":
                vehicle.vehicle_type,

            "registration_number":
                vehicle.registration_number,

            "model":
                vehicle.model,

            "capacity":
                vehicle.capacity,

            "is_available":
                vehicle.is_available,

        }

    }), 201


# ==================================================
# UPDATE VEHICLE
# ==================================================

@vehicle_bp.route(
    "/<int:vehicle_id>",
    methods=["PATCH"]
)
@jwt_required()
def update_vehicle(
    vehicle_id
):

    current_driver = (
        get_current_driver()
    )


    if not current_driver:

        return jsonify({
            "error":
                "Driver profile not found."
        }), 404


    vehicle = Vehicle.query.get(
        vehicle_id
    )


    if not vehicle:

        return jsonify({
            "error":
                "Vehicle not found."
        }), 404


    # ==============================================
    # OWNERSHIP CHECK
    # ==============================================

    if not vehicle_belongs_to_driver(
        vehicle,
        current_driver
    ):

        return jsonify({
            "error":
                "You are not authorized to update this vehicle."
        }), 403


    data = request.get_json()


    if not data:

        return jsonify({
            "error":
                "Request body is required."
        }), 400


    # ==============================================
    # VEHICLE TYPE
    # ==============================================

    if "vehicle_type" in data:

        vehicle_type = str(
            data["vehicle_type"]
        ).strip()


        if not vehicle_type:

            return jsonify({
                "error":
                    "Vehicle type cannot be empty."
            }), 400


        vehicle.vehicle_type = (
            vehicle_type
        )


    # ==============================================
    # REGISTRATION NUMBER
    # ==============================================

    if "registration_number" in data:

        registration_number = str(
            data["registration_number"]
        ).strip().upper()


        if not registration_number:

            return jsonify({
                "error":
                    "Registration number cannot be empty."
            }), 400


        existing_vehicle = (
            Vehicle.query.filter(
                Vehicle.registration_number ==
                    registration_number,
                Vehicle.id != vehicle.id
            ).first()
        )


        if existing_vehicle:

            return jsonify({
                "error":
                    "A vehicle with this registration number already exists."
            }), 409


        vehicle.registration_number = (
            registration_number
        )


    # ==============================================
    # MODEL
    # ==============================================

    if "model" in data:

        vehicle.model = (
            str(data["model"]).strip()
            if data["model"]
            else None
        )


    # ==============================================
    # CAPACITY
    # ==============================================

    if "capacity" in data:

        capacity = data["capacity"]


        if capacity is None or capacity == "":

            vehicle.capacity = None

        else:

            try:

                parsed_capacity = float(
                    capacity
                )

            except (
                TypeError,
                ValueError
            ):

                return jsonify({
                    "error":
                        "Capacity must be a valid number."
                }), 400


            if parsed_capacity <= 0:

                return jsonify({
                    "error":
                        "Capacity must be greater than zero."
                }), 400


            vehicle.capacity = (
                parsed_capacity
            )


    # ==============================================
    # AVAILABILITY
    # ==============================================

    if "is_available" in data:

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


        vehicle.is_available = (
            is_available
        )


    db.session.commit()


    return jsonify({

        "message":
            "Vehicle updated successfully.",

        "vehicle": {

            "id":
                vehicle.id,

            "driver_id":
                vehicle.driver_id,

            "vehicle_type":
                vehicle.vehicle_type,

            "registration_number":
                vehicle.registration_number,

            "model":
                vehicle.model,

            "capacity":
                vehicle.capacity,

            "is_available":
                vehicle.is_available,

        }

    }), 200


# ==================================================
# DELETE VEHICLE
# ==================================================

@vehicle_bp.route(
    "/<int:vehicle_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_vehicle(
    vehicle_id
):

    current_driver = (
        get_current_driver()
    )


    if not current_driver:

        return jsonify({
            "error":
                "Driver profile not found."
        }), 404


    vehicle = Vehicle.query.get(
        vehicle_id
    )


    if not vehicle:

        return jsonify({
            "error":
                "Vehicle not found."
        }), 404


    # ==============================================
    # OWNERSHIP CHECK
    # ==============================================

    if not vehicle_belongs_to_driver(
        vehicle,
        current_driver
    ):

        return jsonify({
            "error":
                "You are not authorized to delete this vehicle."
        }), 403


    # ==============================================
    # PREVENT DELETING AN ACTIVE VEHICLE
    # ==============================================

    if vehicle.is_available:

        return jsonify({
            "error":
                "Mark the vehicle unavailable before deleting it."
        }), 400


    db.session.delete(
        vehicle
    )

    db.session.commit()


    return jsonify({
        "message":
            "Vehicle deleted successfully."
    }), 200