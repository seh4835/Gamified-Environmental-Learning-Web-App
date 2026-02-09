from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta

from extensions import db
from models import User

#Blueprint Initualization

auth_bp=Blueprint("auth",__name__)

#register new user

@auth_bp.route("/register", methods=["POST"])
def register():
    data=request.get_json()

    #basic validation
    required_fields=["name", "email", "password"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error":f"{field} is required"}), 400
        
    #check if user already exists
    existing_user=User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 409
    
    #hash password
    hashed_password=generate_password_hash(data["password"])

    #create new user
    new_user=User(
        name=data["name"],
        email=data["email"],
        password=hashed_password,
        role=data.get("role","student"),
        institution=data.get("institution")
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered Successfully"
    }), 201

#Login User
@auth_bp.route("/login", methods=["POST"])
def login():
    data=request.get_json()

    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": " Email and password are required"}), 400
    
    user=User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401
    
    #create JWT token
    access_token=create_access_token(
        identity=user.id,
        expires_delta=timedelta(hours=6)
    )

    return jsonify({
        "access_token": access_token,
        "user":{
            "id": user.id,
            "name":user.name,
            "role": user.role,
            "institution": user.institution,
            "eco_points": user.eco_points
        }
    }), 200