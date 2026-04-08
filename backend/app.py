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
from routes.users import users_bp
from routes.modules import modules_bp
from routes.quizzes import quizzes_bp
from routes.challenges import challenges_bp
from routes.leaderboard import leaderboard_bp
from routes.admin import admin_bp


def create_app():
    """
    create and configure the Flask application
    """

    load_dotenv()

    app = Flask(__name__)
    app.url_map.strict_slashes = False  # Disable trailing slash redirect for CORS compatibility

    # Core configuration
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "eco-learn-secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///ecolearn.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "eco-learn-jwt-secret")
    app.config["UPLOAD_FOLDER"] = "uploads/challenge_proofs"
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5 MB limit

    # Initialize Extensions
    CORS(app, 
         resources={r"/api/*": {
             #"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000"],
                "origins": "*",  # Allow all origins for development; restrict in production
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
         }})
    db.init_app(app)
    jwt.init_app(app)

    # Registering Blueprints
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
        return jsonify({
            "status": "running",
            "service": "EcoLearn Backend",
            "version": "1.0.0"
        }), 200

    # Seed Database Endpoint
    @app.route("/api/seed", methods=["POST"])
    def seed_database():
        """
        Seed the database with learning modules.
        """
        from models import LearningModule
        
        modules_data = [
            {
                "title": "Climate Change & Global Warming",
                "description": "This module explores the scientific basis of climate change, greenhouse gas emissions, anthropogenic impacts, global temperature rise, and mitigation strategies such as carbon reduction and renewable transition.",
                "difficulty": "Beginner",
                "points": 50
            },
            {
                "title": "Waste Management & Circular Economy",
                "description": "Learn about solid waste management, recycling systems, composting, plastic pollution, and how circular economy principles reduce environmental degradation.",
                "difficulty": "Beginner",
                "points": 50
            },
            {
                "title": "Water Conservation & Sustainable Usage",
                "description": "Understand groundwater depletion, water scarcity challenges, rainwater harvesting systems, and sustainable water management practices.",
                "difficulty": "Beginner",
                "points": 50
            },
            {
                "title": "Renewable Energy Systems",
                "description": "Study solar, wind, hydro, and biomass energy systems and their role in reducing fossil fuel dependency.",
                "difficulty": "Intermediate",
                "points": 70
            },
            {
                "title": "Biodiversity & Ecosystem Protection",
                "description": "Explore ecosystem balance, habitat destruction, species extinction, and biodiversity conservation strategies.",
                "difficulty": "Intermediate",
                "points": 70
            },
            {
                "title": "Sustainable Agriculture & Food Systems",
                "description": "Learn about organic farming, soil conservation, water-efficient irrigation, and food sustainability practices.",
                "difficulty": "Intermediate",
                "points": 80
            },
            {
                "title": "Urban Sustainability & Smart Cities",
                "description": "Examine green infrastructure, sustainable transport systems, waste-efficient urban planning, and smart city innovations.",
                "difficulty": "Advanced",
                "points": 90
            },
            {
                "title": "Carbon Footprint & Lifestyle Choices",
                "description": "Calculate and reduce personal carbon footprints through lifestyle modifications and responsible consumption.",
                "difficulty": "Advanced",
                "points": 100
            },
            {
                "title": "Environmental Policy & SDGs",
                "description": "Understand global environmental policies, India's NEP 2020 integration, and the UN Sustainable Development Goals.",
                "difficulty": "Advanced",
                "points": 100
            },
            {
                "title": "Community Action & Grassroots Sustainability",
                "description": "Learn how local community initiatives drive sustainable development through eco-clubs, clean-up drives, and collective action.",
                "difficulty": "Advanced",
                "points": 120
            }
        ]
        
        try:
            # Check if modules already exist
            existing_count = LearningModule.query.count()
            if existing_count > 0:
                return jsonify({"message": f"Database already has {existing_count} modules"}), 200
            
            # Add modules
            for data in modules_data:
                module = LearningModule(**data)
                db.session.add(module)
            
            db.session.commit()
            return jsonify({"message": "Modules seeded successfully!", "count": len(modules_data)}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app


# Application Bootstrap
app = create_app()

# Create database tables on startup (with error handling)
with app.app_context():
    try:
        db.create_all()
        print("✅ Database tables created/verified!")
    except Exception as e:
        print(f"⚠️  Database connection issue: {e}")
        print("Make sure DATABASE_URL in .env is correct and the database is accessible.")
        print("Server will continue running, but database operations may fail.")

if __name__ == "__main__":
    
    app.run(host="0.0.0.0", port=5000, debug=True)