
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from models import User

#Blueprint Initialization
leaderboard_bp=Blueprint("leaderboard", __name__)

#Global Leaderboard
@leaderboard_bp.route("/", methods=["GET"])
@jwt_required()

def global_leaderboard():
    limit=request.args.get("limit", default=10, type=int)
    users=(
        User.query
        .filter_by(role="student")
        .order_by(User.eco_points.desc())
        .limit(limit)
        .all()
    )

    result=[]
    rank=1
    for user in users:
        result.append({
            "rank": rank,
            "user_id": user.id,
            "name": user.name,
            "institution": user.institution,
            "eco_points": user.eco_points
        })
        rank+=1

    return jsonify(result), 200

#School-wise Leaderboard
@leaderboard_bp.route("/school/<string:institution", methods=["GET"])
@jwt_required()

def school_leaderboard(institution):
    users=(
        User.query
        .filter_by(role="student", institution=institution)
        .order_by(User.eco_points.desc())
        .all()
    )

    if not users:
        return jsonify({"message": "No users found for this institution"}), 404
    
    result=[]
    rank=1
    for user in users:
        result.append({
            "rank": rank,
            "user_id": user.id,
            "name": user.name,
            "eco_points": user.eco_points
        })
        rank+=1

    return jsonify({
        "institution": institution,
        "leaderboard": result
    }), 200