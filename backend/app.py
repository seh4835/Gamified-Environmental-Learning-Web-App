"""
Purpose of this file:
flask app creation
loading configuration
intializing extensions
registering all feature modules 
running the application
"""
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from extensions import db, jwt
from routes.auth import auth_bp
from routes.users import user_bp
from routes.modules import module_bp
from routes.quizzes import quiz_bp
from routes.challenges import challenge_bp
from routes.leaderboards import leaderboard_bp
from route.admin import admin_bp

def create_app():
    """
    create and configure the Flask application
    """

load_dotenv()

app =Flask(__name__)

#Core configuration
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "eco-learn-secret")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL", "sqlite:///ecolearn.db"
    )
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "eco-learn-jwt-secret")
app.config["UPLOAD_FOLDER"] = "uploads/challenge_proofs"
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5 MB limit
    # Initialize Extensions
CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)
jwt.init_app(app)

 # Registering Bliwprints

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(users_bp, url_prefix="/api/users")
app.register_blueprint(modules_bp, url_prefix="/api/modules")
app.register_blueprint(quizzes_bp, url_prefix="/api/quizzes")
app.register_blueprint(challenges_bp, url_prefix="/api/challenges")
app.register_blueprint(leaderboard_bp, url_prefix="/api/leaderboard")
app.register_blueprint(admin_bp, url_prefix="/api/admin")

# Health Check Endpoint

@app.route("/api/health", methods=["GET"])
def health_check():
        """
        Simple endpoint to verify that the backend is running.
        Useful for debugging, deployment checks, and monitoring.
        """
        return jsonify({"status": "running","service": "EcoLearn Backend","version": "1.0.0" }), 200