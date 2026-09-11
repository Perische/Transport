from flask import Blueprint, jsonify, request

from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from werkzeug.security import (
    generate_password_hash
)

from models import db, User


user_bp = Blueprint(
    "users",
    __name__,
    url_prefix="/api/users"
)


# ==================================================
# HELPER
# ==================================================

def get_current_user():

    user_id = get_jwt_identity()

    try:

        user_id = int(user_id)

    except (TypeError, ValueError):

        return None

    return User.query.get(user_id)


# ==================================================
# GET ALL USERS
# ==================================================

@user_bp.route(
    "/",
    methods=["GET"]
)
@jwt_required()
def get_users():

    users = User.query.order_by(
        User.created_at.desc()
    ).all()


    return jsonify([
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "created_at": (
                user.created_at.isoformat()
                if user.created_at
                else None
            )
        }

        for user in users
    ]), 200


# ==================================================
# GET ONE USER
# ==================================================

@user_bp.route(
    "/<int:user_id>",
    methods=["GET"]
)
@jwt_required()
def get_user(user_id):

    current_user = get_current_user()


    if not current_user:

        return jsonify({
            "error": "User account not found."
        }), 404


    # ==============================================
    # OWNERSHIP CHECK
    # ==============================================

    if current_user.id != user_id:

        return jsonify({
            "error":
                "You are not authorized to view this user."
        }), 403


    user = User.query.get(user_id)


    if not user:

        return jsonify({
            "error": "User not found."
        }), 404


    return jsonify({

        "id": user.id,

        "name": user.name,

        "email": user.email,

        "role": user.role,

        "created_at": (
            user.created_at.isoformat()
            if user.created_at
            else None
        )

    }), 200


# ==================================================
# CREATE USER
# ==================================================

@user_bp.route(
    "/",
    methods=["POST"]
)
def create_user():

    data = request.get_json()


    if not data:

        return jsonify({
            "error":
                "Request body is required."
        }), 400


    required_fields = [
        "name",
        "email",
        "password"
    ]


    for field in required_fields:

        if not data.get(field):

            return jsonify({
                "error":
                    f"{field} is required."
            }), 400


    name = data["name"].strip()

    email = data["email"].strip().lower()

    password = data["password"]


    if len(password) < 6:

        return jsonify({
            "error":
                "Password must be at least 6 characters."
        }), 400


    existing_user = User.query.filter_by(
        email=email
    ).first()


    if existing_user:

        return jsonify({
            "error":
                "Email already registered."
        }), 409


    role = data.get(
        "role",
        "customer"
    )


    if role not in [
        "customer",
        "driver"
    ]:

        return jsonify({
            "error":
                "Invalid role."
        }), 400


    hashed_password = (
        generate_password_hash(
            password
        )
    )


    user = User(

        name=name,

        email=email,

        password=hashed_password,

        role=role

    )


    db.session.add(user)

    db.session.commit()


    return jsonify({

        "message":
            "User created successfully.",

        "user": {

            "id": user.id,

            "name": user.name,

            "email": user.email,

            "role": user.role,

            "created_at": (
                user.created_at.isoformat()
                if user.created_at
                else None
            )

        }

    }), 201


# ==================================================
# UPDATE USER
# ==================================================

@user_bp.route(
    "/<int:user_id>",
    methods=["PATCH"]
)
@jwt_required()
def update_user(user_id):

    current_user = get_current_user()


    if not current_user:

        return jsonify({
            "error":
                "User account not found."
        }), 404


    # ==============================================
    # OWNERSHIP CHECK
    # ==============================================

    if current_user.id != user_id:

        return jsonify({
            "error":
                "You are not authorized to update this user."
        }), 403


    user = User.query.get(user_id)


    if not user:

        return jsonify({
            "error":
                "User not found."
        }), 404


    data = request.get_json()


    if not data:

        return jsonify({
            "error":
                "Request body is required."
        }), 400


    # ==============================================
    # UPDATE NAME
    # ==============================================

    if "name" in data:

        name = str(
            data["name"]
        ).strip()


        if not name:

            return jsonify({
                "error":
                    "Name cannot be empty."
            }), 400


        user.name = name


    # ==============================================
    # UPDATE EMAIL
    # ==============================================

    if "email" in data:

        email = str(
            data["email"]
        ).strip().lower()


        if not email:

            return jsonify({
                "error":
                    "Email cannot be empty."
            }), 400


        existing_user = User.query.filter(
            User.email == email,
            User.id != user.id
        ).first()


        if existing_user:

            return jsonify({
                "error":
                    "Email already registered."
            }), 409


        user.email = email


    # ==============================================
    # UPDATE PASSWORD
    # ==============================================

    if "password" in data:

        password = data["password"]


        if not password:

            return jsonify({
                "error":
                    "Password cannot be empty."
            }), 400


        if len(password) < 6:

            return jsonify({
                "error":
                    "Password must be at least 6 characters."
            }), 400


        user.password = (
            generate_password_hash(
                password
            )
        )


    # ==============================================
    # ROLE CANNOT BE CHANGED HERE
    # ==============================================

    if "role" in data:

        return jsonify({
            "error":
                "User role cannot be changed through this endpoint."
        }), 403


    db.session.commit()


    return jsonify({

        "message":
            "User updated successfully.",

        "user": {

            "id": user.id,

            "name": user.name,

            "email": user.email,

            "role": user.role,

            "created_at": (
                user.created_at.isoformat()
                if user.created_at
                else None
            )

        }

    }), 200


# ==================================================
# DELETE USER
# ==================================================

@user_bp.route(
    "/<int:user_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_user(user_id):

    current_user = get_current_user()


    if not current_user:

        return jsonify({
            "error":
                "User account not found."
        }), 404


    # ==============================================
    # OWNERSHIP CHECK
    # ==============================================

    if current_user.id != user_id:

        return jsonify({
            "error":
                "You are not authorized to delete this user."
        }), 403


    user = User.query.get(user_id)


    if not user:

        return jsonify({
            "error":
                "User not found."
        }), 404


    db.session.delete(user)

    db.session.commit()


    return jsonify({
        "message":
            "User deleted successfully."
    }), 200