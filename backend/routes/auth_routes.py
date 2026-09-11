from flask import Blueprint, jsonify, request

from flask_jwt_extended import (
    create_access_token
)

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from models import db, User


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


# ==================================================
# REGISTER
# ==================================================

@auth_bp.route(
    "/register",
    methods=["POST"]
)
def register():

    data = request.get_json()


    if not data:

        return jsonify({
            "error": "Request body is required"
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
                    f"{field} is required"
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
                "Email already registered"
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
                "Invalid role"
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


    # ==============================================
    # CREATE JWT
    # ==============================================

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role,
            "name": user.name
        }
    )


    return jsonify({

        "message":
            "Registration successful",

        "access_token":
            access_token,

        "user": {

            "id": user.id,

            "name": user.name,

            "email": user.email,

            "role": user.role

        }

    }), 201


# ==================================================
# LOGIN
# ==================================================

@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():

    data = request.get_json()


    if not data:

        return jsonify({
            "error":
                "Request body is required"
        }), 400


    email = data.get("email")

    password = data.get("password")


    if not email or not password:

        return jsonify({
            "error":
                "Email and password are required"
        }), 400


    email = email.strip().lower()


    user = User.query.filter_by(
        email=email
    ).first()


    if not user:

        return jsonify({
            "error":
                "Invalid email or password"
        }), 401


    if not check_password_hash(
        user.password,
        password
    ):

        return jsonify({
            "error":
                "Invalid email or password"
        }), 401


    # ==============================================
    # CREATE JWT
    # ==============================================

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role,
            "name": user.name
        }
    )


    return jsonify({

        "message":
            "Login successful",

        "access_token":
            access_token,

        "user": {

            "id": user.id,

            "name": user.name,

            "email": user.email,

            "role": user.role

        }

    }), 200