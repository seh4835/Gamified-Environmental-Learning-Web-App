from datetime import datetime
from flask import Blueprint, jsonify, request
from extensions import jwt_required, get_jwt_identity
from extensions import db
from models import ChallengeSubmission, EcoChallenge, User

# Blueprint initialization
admin_bp = Blueprint("admin", __name__)


# Helper: Role Check
def is_admin_or_teacher(user: User) -> bool:
    return user.role in ["teacher", "admin"]


# View ALL Submissions (used by Admin.jsx frontend)
@admin_bp.route("/submissions", methods=["GET"])
@jwt_required()
def get_all_submissions():
    admin_id = get_jwt_identity()
    admin_user = User.query.get(admin_id)
    if not admin_user or not is_admin_or_teacher(admin_user):
        return jsonify({"error": "Unauthorized Access"}), 403

    submissions = ChallengeSubmission.query.order_by(ChallengeSubmission.submitted_at.desc()).all()
    result = []
    for sub in submissions:
        student = User.query.get(sub.user_id)
        challenge = EcoChallenge.query.get(sub.challenge_id)
        result.append({
            "id": sub.id,
            "user": student.name if student else f"User #{sub.user_id}",
            "module": challenge.title if challenge else f"Challenge #{sub.challenge_id}",
            "task": challenge.description if challenge else "",
            "proof_url": sub.proof_url,
            "status": sub.status.capitalize(),
            "points": challenge.points if challenge else 0,
            "created_at": sub.submitted_at.strftime("%Y-%m-%d") if sub.submitted_at else ""
        })
    return jsonify(result), 200


# View Pending Submissions
@admin_bp.route("/submissions/pending", methods=["GET"])
@jwt_required()
def get_pending_submissions():
    admin_id = get_jwt_identity()
    admin_user = User.query.get(admin_id)
    if not admin_user or not is_admin_or_teacher(admin_user):
        return jsonify({"error": "Unauthorized Access"}), 403

    submissions = ChallengeSubmission.query.filter_by(status="pending").all()
    result = []
    for sub in submissions:
        result.append({
            "submission_id": sub.id,
            "user_id": sub.user_id,
            "challenge_id": sub.challenge_id,
            "proof_url": sub.proof_url,
            "submitted_at": sub.submitted_at.isoformat()
        })
    return jsonify(result), 200


# Approve Submission  (called by Admin.jsx: POST /admin/approve/:id)
@admin_bp.route("/approve/<int:submission_id>", methods=["POST"])
@jwt_required()
def approve_submission(submission_id):
    admin_id = get_jwt_identity()
    admin_user = User.query.get(admin_id)
    if not admin_user or not is_admin_or_teacher(admin_user):
        return jsonify({"error": "Unauthorized Access"}), 403

    submission = ChallengeSubmission.query.get(submission_id)
    if not submission:
        return jsonify({"error": "Submission not found"}), 404

    submission.status = "approved"
    submission.reviewed_at = datetime.utcnow()

    challenge = EcoChallenge.query.get(submission.challenge_id)
    user = User.query.get(submission.user_id)
    if challenge and user:
        user.eco_points += challenge.points
        db.session.commit()
        # Auto-award badges
        try:
            from routes.users import award_badges_for_user
            award_badges_for_user(user)
        except Exception as badge_err:
            print(f"Badge award error (non-critical): {badge_err}")
    else:
        db.session.commit()

    return jsonify({"message": "Submission approved", "submission_id": submission.id}), 200


# Reject Submission  (called by Admin.jsx: POST /admin/reject/:id)
@admin_bp.route("/reject/<int:submission_id>", methods=["POST"])
@jwt_required()
def reject_submission(submission_id):
    admin_id = get_jwt_identity()
    admin_user = User.query.get(admin_id)
    if not admin_user or not is_admin_or_teacher(admin_user):
        return jsonify({"error": "Unauthorized Access"}), 403

    submission = ChallengeSubmission.query.get(submission_id)
    if not submission:
        return jsonify({"error": "Submission not found"}), 404

    submission.status = "rejected"
    submission.reviewed_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Submission rejected", "submission_id": submission.id}), 200


# Approve or Reject Submission via review endpoint
@admin_bp.route("/submissions/<int:submission_id>/review", methods=["POST"])
@jwt_required()
def review_submission(submission_id):
    admin_id = get_jwt_identity()
    admin_user = User.query.get(admin_id)
    if not admin_user or not is_admin_or_teacher(admin_user):
        return jsonify({"error": "Unauthorized Access"}), 403

    data = request.get_json()
    action = data.get("action") if data else None

    if action not in ["approve", "reject"]:
        return jsonify({"error": "Action must be 'approve' or 'reject'"}), 400

    submission = ChallengeSubmission.query.get(submission_id)
    if not submission:
        return jsonify({"error": "Submission not found"}), 404

    if submission.status != "pending":
        return jsonify({"error": "Submission already reviewed"}), 400

    submission.status = "approved" if action == "approve" else "rejected"
    submission.reviewed_at = datetime.utcnow()

    if action == "approve":
        challenge = EcoChallenge.query.get(submission.challenge_id)
        user = User.query.get(submission.user_id)
        if challenge and user:
            user.eco_points += challenge.points

    db.session.commit()

    return jsonify({
        "message": f"Submission {action}d successfully",
        "submission_id": submission.id,
        "new_status": submission.status
    }), 200


# Admin Summary (basic reporting)
@admin_bp.route("/summary", methods=["GET"])
@jwt_required()
def admin_summary():
    admin_id = get_jwt_identity()
    admin_user = User.query.get(admin_id)

    if not admin_user or not is_admin_or_teacher(admin_user):
        return jsonify({"error": "Unauthorized access"}), 403

    total_submissions = ChallengeSubmission.query.count()
    pending_submissions = ChallengeSubmission.query.filter_by(status="pending").count()
    approved_submissions = ChallengeSubmission.query.filter_by(status="approved").count()
    total_users = User.query.filter_by(role="student").count()

    return jsonify({
        "total_students": total_users,
        "total_submissions": total_submissions,
        "pending_submissions": pending_submissions,
        "approved_submissions": approved_submissions
    }), 200
