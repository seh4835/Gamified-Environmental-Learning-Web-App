from datetime import datetime
from flask import Blueprint, jsonify
from extensions import jwt_required, get_jwt_identity

from models import User, UserBadge, Badge, QuizAttempt, ChallengeSubmission
from extensions import db

# Blueprint Initialization
users_bp = Blueprint("users", __name__)


# ─────────────────────────────────────────────
# Helper: Seed default badges if none exist
# ─────────────────────────────────────────────
DEFAULT_BADGES = [
    {"name": "🌱 Eco Starter",      "description": "Earned your first eco points!",              "required_points": 10},
    {"name": "🔥 Rising Green",     "description": "Earned 50 eco points.",                       "required_points": 50},
    {"name": "🌿 Eco Explorer",     "description": "Reached 100 eco points.",                     "required_points": 100},
    {"name": "🌍 Planet Protector", "description": "Reached 250 eco points.",                     "required_points": 250},
    {"name": "⚡ Eco Champion",     "description": "Reached 500 eco points.",                     "required_points": 500},
    {"name": "🏆 Sustainability Hero", "description": "Earned 1000 eco points. True hero!",       "required_points": 1000},
]

def ensure_badges_exist():
    """Create default badge rows if the badge table is empty."""
    if Badge.query.count() == 0:
        for bd in DEFAULT_BADGES:
            db.session.add(Badge(
                name=bd["name"],
                description=bd["description"],
                required_points=bd["required_points"]
            ))
        db.session.commit()


def award_badges_for_user(user):
    """
    Check all badges the user qualifies for (based on eco_points) and
    award any they haven't received yet. Returns list of newly awarded badges.
    """
    ensure_badges_exist()

    # IDs of badges user already has
    existing_badge_ids = {
        ub.badge_id for ub in UserBadge.query.filter_by(user_id=user.id).all()
    }

    all_badges = Badge.query.order_by(Badge.required_points.asc()).all()
    newly_awarded = []

    for badge in all_badges:
        if badge.id not in existing_badge_ids and user.eco_points >= badge.required_points:
            ub = UserBadge(
                user_id=user.id,
                badge_id=badge.id,
                earned_at=datetime.utcnow()
            )
            db.session.add(ub)
            newly_awarded.append(badge)

    if newly_awarded:
        db.session.commit()

    return newly_awarded


# ─────────────────────────────────────────────
# Get Current User Profile
# ─────────────────────────────────────────────
@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_my_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "institution": user.institution,
        "eco_points": user.eco_points,
        "created_at": user.created_at.isoformat()
    }), 200


# ─────────────────────────────────────────────
# Get User Dashboard Summary
# ─────────────────────────────────────────────
@users_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard_summary():
    """
    Returns summarized dashboard data for the authenticated user:
    - Eco points
    - Badges earned (auto-awards new ones based on current points)
    - Quizzes completed count  (score != -1 → real quiz attempts)
    - Modules completed count  (score == -1 → module completion marker)
    - Challenges submitted/approved count
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Auto-award any new badges the user now qualifies for
    award_badges_for_user(user)

    # Fetch updated badge list
    badges = (
        db.session.query(Badge)
        .join(UserBadge, UserBadge.badge_id == Badge.id)
        .filter(UserBadge.user_id == user.id)
        .order_by(Badge.required_points.asc())
        .all()
    )

    # Real quiz submissions (score != -1)
    quizzes_completed = QuizAttempt.query.filter(
        QuizAttempt.user_id == user.id,
        QuizAttempt.score != -1
    ).count()

    # Module completions (score == -1, used as a marker) — also get specific module IDs
    completed_module_records = QuizAttempt.query.filter(
        QuizAttempt.user_id == user.id,
        QuizAttempt.score == -1
    ).all()
    modules_completed = len(completed_module_records)
    completed_module_ids = [r.module_id for r in completed_module_records]

    # Challenge submissions (pending + approved)
    challenges_submitted = ChallengeSubmission.query.filter_by(user_id=user.id).count()
    challenges_approved = ChallengeSubmission.query.filter_by(
        user_id=user.id, status="approved"
    ).count()

    badge_data = [
        {
            "id": b.id,
            "name": b.name,
            "description": b.description,
            "required_points": b.required_points
        }
        for b in badges
    ]

    return jsonify({
        "eco_points": user.eco_points,
        "badges": badge_data,
        "quizzes_completed": quizzes_completed,
        "modules_completed": modules_completed,
        "completed_module_ids": completed_module_ids,
        "challenges_completed": challenges_approved,
        "challenges_submitted": challenges_submitted,
    }), 200
