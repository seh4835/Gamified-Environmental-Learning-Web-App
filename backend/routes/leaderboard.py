from flask import Blueprint, request, jsonify
from models import User
from sqlalchemy import desc

# Blueprint Initialization
leaderboard_bp = Blueprint("leaderboard", __name__)

# Global Leaderboard (PUBLIC - no JWT)
@leaderboard_bp.route("/", methods=["GET"])
def global_leaderboard():
    try:
        limit = request.args.get("limit", default=50, type=int)

        users = (
            User.query
            .filter(User.role == "student")
            .order_by(desc(User.eco_points))
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


# School-wise Leaderboard (PUBLIC)
@leaderboard_bp.route("/school/<string:institution>", methods=["GET"])
def school_leaderboard(institution):
    try:
        users = (
            User.query
            .filter(
                User.role == "student",
                User.institution == institution
            )
            .order_by(desc(User.eco_points))
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