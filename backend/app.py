from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from models import db

from routes.auth_routes import auth_bp
from routes.user import user_bp
from routes.driver_routes import driver_bp
from routes.vehicle_routes import vehicle_bp
from routes.delivery_routes import delivery_bp
from routes.trips import trips_bp


app = Flask(__name__)

app.config.from_object(Config)


# ==================================================
# EXTENSIONS
# ==================================================

CORS(app)

db.init_app(app)

jwt = JWTManager(app)


# ==================================================
# BLUEPRINTS
# ==================================================

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(driver_bp)
app.register_blueprint(vehicle_bp)
app.register_blueprint(delivery_bp)
app.register_blueprint(trips_bp)


# ==================================================
# HOME
# ==================================================

@app.route("/")
def home():

    return jsonify({
        "message": "Welcome to MoveIt API",
        "status": "running"
    })


# ==================================================
# HEALTH CHECK
# ==================================================

@app.route("/api/health")
def health():

    return jsonify({
        "status": "healthy"
    })


# ==================================================
# DATABASE
# ==================================================

with app.app_context():

    db.create_all()


# ==================================================
# RUN SERVER
# ==================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )