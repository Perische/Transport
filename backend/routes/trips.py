from flask import Blueprint, jsonify, request

from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from models import (
    db,
    User,
    Driver,
    Vehicle,
    Delivery,
)


trips_bp = Blueprint(
    "trips",
    __name__,
    url_prefix="/api/trips"
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


def serialize_trip(
    trip
):

    return {

        "id":
            trip.id,

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
        ),

    }


# ==================================================
# GET ALL TRIPS
# ==================================================

@trips_bp.route(
    "/",
    methods=["GET"]
)
@jwt_required()
def get_trips():

    current_user = get_current_user()


    if not current_user:

        return jsonify({
            "error":
                "User account not found."
        }), 404


    # ==============================================
    # CUSTOMERS ONLY SEE THEIR OWN TRIPS
    # ==============================================

    if current_user.role == "customer":

        trips = Delivery.query.filter_by(
            customer_id=current_user.id
        ).order_by(
            Delivery.created_at.desc()
        ).all()


        return jsonify([

            serialize_trip(trip)

            for trip in trips

        ]), 200


    # ==============================================
    # DRIVERS SEE AVAILABLE + THEIR OWN TRIPS
    # ==============================================

    if current_user.role == "driver":

        current_driver = (
            get_current_driver()
        )


        if not current_driver:

            return jsonify({
                "error":
                    "Driver profile not found."
            }), 404


        trips = Delivery.query.filter(
            db.or_(
                Delivery.status == "pending",
                Delivery.driver_id ==
                    current_driver.id
            )
        ).order_by(
            Delivery.created_at.desc()
        ).all()


        return jsonify([

            serialize_trip(trip)

            for trip in trips

        ]), 200


    return jsonify({
        "error":
            "Invalid user role."
    }), 403


# ==================================================
# GET ONE TRIP
# ==================================================

@trips_bp.route(
    "/<int:trip_id>",
    methods=["GET"]
)
@jwt_required()
def get_trip(
    trip_id
):

    current_user = get_current_user()


    if not current_user:

        return jsonify({
            "error":
                "User account not found."
        }), 404


    trip = Delivery.query.get(
        trip_id
    )


    if not trip:

        return jsonify({
            "error":
                "Trip not found."
        }), 404


    # ==============================================
    # CUSTOMER OWNERSHIP
    # ==============================================

    if current_user.role == "customer":

        if trip.customer_id != current_user.id:

            return jsonify({
                "error":
                    "You are not authorized to view this delivery."
            }), 403


    # ==============================================
    # DRIVER ACCESS
    # ==============================================

    elif current_user.role == "driver":

        current_driver = (
            get_current_driver()
        )


        if not current_driver:

            return jsonify({
                "error":
                    "Driver profile not found."
            }), 404


        # Drivers may see pending deliveries
        # or deliveries assigned to themselves.

        if (
            trip.status != "pending"
            and
            trip.driver_id !=
                current_driver.id
        ):

            return jsonify({
                "error":
                    "You are not authorized to view this delivery."
            }), 403


    else:

        return jsonify({
            "error":
                "Invalid user role."
        }), 403


    return jsonify(
        serialize_trip(trip)
    ), 200


# ==================================================
# CREATE DELIVERY
# ==================================================

@trips_bp.route(
    "/",
    methods=["POST"]
)
@jwt_required()
def create_trip():

    current_user = get_current_user()


    if not current_user:

        return jsonify({
            "error":
                "User account not found."
        }), 404


    # ==============================================
    # ONLY CUSTOMERS CREATE DELIVERIES
    # ==============================================

    if current_user.role != "customer":

        return jsonify({
            "error":
                "Only customer accounts can create deliveries."
        }), 403


    data = request.get_json()


    if not data:

        return jsonify({
            "error":
                "Request body is required."
        }), 400


    pickup_location = data.get(
        "pickup_location"
    )

    delivery_location = data.get(
        "delivery_location"
    )

    package_description = data.get(
        "package_description"
    )


    if not pickup_location:

        return jsonify({
            "error":
                "Pickup location is required."
        }), 400


    if not delivery_location:

        return jsonify({
            "error":
                "Delivery location is required."
        }), 400


    if not package_description:

        return jsonify({
            "error":
                "Package description is required."
        }), 400


    pickup_location = str(
        pickup_location
    ).strip()


    delivery_location = str(
        delivery_location
    ).strip()


    package_description = str(
        package_description
    ).strip()


    if not pickup_location:

        return jsonify({
            "error":
                "Pickup location cannot be empty."
        }), 400


    if not delivery_location:

        return jsonify({
            "error":
                "Delivery location cannot be empty."
        }), 400


    if not package_description:

        return jsonify({
            "error":
                "Package description cannot be empty."
        }), 400


    # ==============================================
    # IMPORTANT:
    # customer_id comes from JWT
    # NOT FROM THE REQUEST BODY
    # ==============================================

    trip = Delivery(

        customer_id=
            current_user.id,

        pickup_location=
            pickup_location,

        delivery_location=
            delivery_location,

        package_description=
            package_description,

        status="pending"

    )


    db.session.add(trip)

    db.session.commit()


    return jsonify({

        "message":
            "Delivery created successfully.",

        "trip":
            serialize_trip(trip)

    }), 201


# ==================================================
# ASSIGN DRIVER
# ==================================================

@trips_bp.route(
    "/<int:trip_id>/assign",
    methods=["PATCH"]
)
@jwt_required()
def assign_driver(
    trip_id
):

    current_driver = (
        get_current_driver()
    )


    if not current_driver:

        return jsonify({
            "error":
                "Driver profile not found."
        }), 404


    if not current_driver.is_available:

        return jsonify({
            "error":
                "You must be available before accepting deliveries."
        }), 403


    # ==============================================
    # VEHICLE CHECK
    # ==============================================

    available_vehicle = (
        Vehicle.query.filter_by(
            driver_id=current_driver.id,
            is_available=True
        ).first()
    )


    if not available_vehicle:

        return jsonify({
            "error":
                "You need an available vehicle before accepting deliveries."
        }), 400


    trip = Delivery.query.get(
        trip_id
    )


    if not trip:

        return jsonify({
            "error":
                "Trip not found."
        }), 404


    # ==============================================
    # ONLY PENDING DELIVERIES
    # ==============================================

    if trip.status != "pending":

        return jsonify({
            "error":
                "This delivery is no longer available for assignment."
        }), 400


    # ==============================================
    # DRIVER COMES FROM JWT
    # ==============================================

    trip.driver_id = (
        current_driver.id
    )

    trip.status = "assigned"


    db.session.commit()


    return jsonify({

        "message":
            "Delivery accepted successfully.",

        "trip":
            serialize_trip(trip)

    }), 200


# ==================================================
# UPDATE TRIP STATUS
# ==================================================

@trips_bp.route(
    "/<int:trip_id>/status",
    methods=["PATCH"]
)
@jwt_required()
def update_trip_status(
    trip_id
):

    current_driver = (
        get_current_driver()
    )


    if not current_driver:

        return jsonify({
            "error":
                "Driver profile not found."
        }), 404


    trip = Delivery.query.get(
        trip_id
    )


    if not trip:

        return jsonify({
            "error":
                "Trip not found."
        }), 404


    # ==============================================
    # DRIVER OWNERSHIP CHECK
    # ==============================================

    if trip.driver_id != current_driver.id:

        return jsonify({
            "error":
                "You are not authorized to update this delivery."
        }), 403


    data = request.get_json()


    if not data:

        return jsonify({
            "error":
                "Request body is required."
        }), 400


    new_status = data.get(
        "status"
    )


    allowed_statuses = [
        "pending",
        "assigned",
        "picked_up",
        "in_transit",
        "delivered",
        "cancelled",
    ]


    if new_status not in allowed_statuses:

        return jsonify({
            "error":
                "Invalid delivery status."
        }), 400


    # ==============================================
    # VALID STATUS TRANSITIONS
    # ==============================================

    valid_transitions = {

        "assigned": [
            "picked_up",
            "cancelled",
        ],

        "picked_up": [
            "in_transit",
            "cancelled",
        ],

        "in_transit": [
            "delivered",
            "cancelled",
        ],

    }


    current_status = trip.status


    if new_status not in valid_transitions.get(
        current_status,
        []
    ):

        return jsonify({

            "error":
                (
                    f"Cannot change delivery "
                    f"status from "
                    f"'{current_status}' "
                    f"to '{new_status}'."
                )

        }), 400


    trip.status = new_status


    db.session.commit()


    return jsonify({

        "message":
            "Delivery status updated successfully.",

        "trip":
            serialize_trip(trip)

    }), 200