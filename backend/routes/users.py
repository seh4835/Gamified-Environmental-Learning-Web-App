from flask import Blueprint , jsonify 
from flask_jwt_extended import jwt_required, get_jwt_identity
#BluePrint Initialization
users_bp = Blueprint("users",__name__)

#get current user profile
@users_bp.route("/me",methods=["GET"])
@jwt_required()
def get_my_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error":"User not found"}), 404
    
    return jsonify({
        "id":user.id,
        "name":user.name,
        "email":user.email,
        "role":user.role,
        "instituion":user.instituion,
        "eco_points":user.eco_points,
        "created_at":user.created_at.isoformat()

    }), 200

#get user dashboard summary

@users_bp.route("/dashboard",methods=["GET"])
@jwt_required()

def get_dashboard_summary():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404
    
    badges = (
        db.session.query(Badge)
        .join(UserBagde, UserBadge.badge_id == Badge.id)
        .filter(UserBadge.user_id == user.id)
        .all()
    )

    quiz_attempts_count = QuizAttempt.query.filter_by(user_id=user.id).count()

    challenges_completed_count = ChallengeSubmission.query.filter_by(
        user_id=user.id,
        status="approved"
    ).count()

    badge_data = []
    for badge in badges:
        badge_data.append({
            "id":badge.id,
            "name":badge.name,
            "description":badge.description,
            "required_points":badge.required_points
        })

        return jsonify({
            "eco_points":user.eco_points,
            "badges":badge_data,
            "quiz_attempts":quiz_attempts_count,
            "challenges_completed":challenges_completed_count
        }), 200
