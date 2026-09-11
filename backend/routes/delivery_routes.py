from flask import Blueprint, jsonify

from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from models import db, User, Driver, Delivery


delivery_bp = Blueprint(
    "deliveries",
    __name__,
    url_prefix="/api/deliveries"
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


def serialize_delivery(
    delivery
):

    return {

        "id":
            delivery.id,

        "customer_id":
            delivery.customer_id,

        "driver_id":
            delivery.driver_id,

        "pickup_location":
            delivery.pickup_location,

        "delivery_location":
            delivery.delivery_location,

        "package_description":
            delivery.package_description,

        "status":
            delivery.status,

        "created_at": (
            delivery.created_at.isoformat()
            if delivery.created_at
            else None
        ),

    }


# ==================================================
# CUSTOMER DELIVERIES
# ==================================================

@delivery_bp.route(
    "/customer/<int:customer_id>",
    methods=["GET"]
)
@jwt_required()
def get_customer_deliveries(
    customer_id
):

    current_user = get_current_user()


    if not current_user:

        return jsonify({
            "error":
                "User account not found."
        }), 404


    # ==============================================
    # OWNERSHIP CHECK
    # ==============================================

    if current_user.id != customer_id:

        return jsonify({
            "error":
                "You are not authorized to view these deliveries."
        }), 403


    deliveries = Delivery.query.filter_by(
        customer_id=customer_id
    ).order_by(
        Delivery.created_at.desc()
    ).all()


    return jsonify({

        "deliveries": [

            serialize_delivery(
                delivery
            )

            for delivery in deliveries

        ]

    }), 200


# ==================================================
# DRIVER DELIVERIES
# ==================================================

@delivery_bp.route(
    "/driver/<int:driver_id>",
    methods=["GET"]
)
@jwt_required()
def get_driver_deliveries(
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
                "You are not authorized to view these deliveries."
        }), 403


    deliveries = Delivery.query.filter_by(
        driver_id=driver_id
    ).order_by(
        Delivery.created_at.desc()
    ).all()


    return jsonify({

        "deliveries": [

            serialize_delivery(
                delivery
            )

            for delivery in deliveries

        ]

    }), 200