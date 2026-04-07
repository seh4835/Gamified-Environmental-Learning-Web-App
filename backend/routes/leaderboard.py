
from flask import Blueprint, request, jsonify
from extensions import jwt_required

from models import User

#Blueprint Initialization
leaderboard_bp=Blueprint("leaderboard", __name__)

#Global Leaderboard
@leaderboard_bp.route("/", methods=["GET"])
@jwt_required()
def global_leaderboard():
    try:
        limit = request.args.get("limit", default=50, type=int)
        users = (
            User.query
            .filter_by(role="student")
            .order_by(User.eco_points.desc())
            .limit(limit)
            .all()
        )

        result = []
        rank = 1
        for user in users:
            result.append({
                "id": int(user.id),
                "rank": rank,
                "name": user.name,
                "institution": user.institution,
                "eco_points": int(user.eco_points) if user.eco_points else 0
            })
            rank += 1

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#School-wise Leaderboard
@leaderboard_bp.route("/school/<string:institution>", methods=["GET"])
@jwt_required()
def school_leaderboard(institution):
    try:
        users = (
            User.query
            .filter_by(role="student", institution=institution)
            .order_by(User.eco_points.desc())
            .all()
        )

        if not users:
            return jsonify([]), 200
        
        result = []
        rank = 1
        for user in users:
            result.append({
                "id": int(user.id),
                "rank": rank,
                "name": user.name,
                "institution": user.institution,
                "eco_points": int(user.eco_points) if user.eco_points else 0
            })
            rank += 1

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500