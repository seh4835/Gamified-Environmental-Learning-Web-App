"""
Eco Challenge Routes for EcoLearn

Handles:
- Listing available eco-challenges
- Submitting challenge proof (image/text)
- Viewing user's own submissions
- Local challenge submission (no DB EcoChallenge row required)

All routes are prefixed with /api/challenges
"""

import os
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from extensions import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from extensions import db
from models import EcoChallenge, ChallengeSubmission, User, QuizAttempt

# Blueprint Initialization
challenges_bp = Blueprint("challenges", __name__)


# Helper: Allowed File Extension Check
def allowed_file(filename):
    allowed_extensions = current_app.config.get("ALLOWED_EXTENSIONS", {"png", "jpg", "jpeg", "gif", "pdf"})
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_extensions


# ─────────────────────────────────────────────
# Record Challenge Quiz Attempt
# Called by Challenges.jsx after quiz is submitted
# ─────────────────────────────────────────────
@challenges_bp.route("/record-quiz", methods=["POST"])
@jwt_required()
def record_challenge_quiz():
    """
    Records a quiz attempt from the Challenges page quiz.
    JSON body: { "module": "Climate Change", "score": 4, "total": 5 }
    This makes "Quizzes Done" count reflect challenge quizzes too.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    score = int(data.get("score", 0))
    module_name = str(data.get("module", "")).strip()

    # Find a matching LearningModule by first word of name
    from models import LearningModule
    first_word = module_name.split()[0] if module_name else ""
    module = LearningModule.query.filter(
        LearningModule.title.ilike(f"%{first_word}%")
    ).first() if first_word else None

    module_id = module.id if module else 1  # fallback to module 1

    attempt = QuizAttempt(
        user_id=user.id,
        module_id=module_id,
        score=score
    )
    db.session.add(attempt)
    db.session.commit()

    return jsonify({"message": "Quiz recorded", "score": score}), 201


# ─────────────────────────────────────────────
# Get All Active Eco Challenges
# ─────────────────────────────────────────────
@challenges_bp.route("/", methods=["GET"])
@jwt_required()
def get_all_challenges():
    """
    Returns all active eco-challenges.
    """
    challenges = EcoChallenge.query.filter_by(active=True).all()
    result = []
    for ch in challenges:
        result.append({
            "id": ch.id,
            "title": ch.title,
            "description": ch.description,
            "instructions": ch.instructions,
            "points": ch.points
        })
    return jsonify(result), 200


# ─────────────────────────────────────────────
# Submit Challenge Proof (requires EcoChallenge DB row)
# ─────────────────────────────────────────────
@challenges_bp.route("/submit", methods=["POST"])
@jwt_required()
def submit_challenge():
    """
    Submits proof for an eco-challenge.

    Form-data:
    - challenge_id (int)
    - proof (file, optional)
    - note (text, optional)
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    challenge_id = request.form.get("challenge_id")
    if not challenge_id:
        return jsonify({"error": "challenge_id is required"}), 400

    challenge = EcoChallenge.query.get(challenge_id)
    if not challenge:
        return jsonify({"error": "Challenge not found"}), 404

    proof_file = request.files.get("proof")
    proof_url = None

    if proof_file:
        if not allowed_file(proof_file.filename):
            return jsonify({"error": "Invalid file type"}), 400
        filename = secure_filename(proof_file.filename)
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, f"user_{user_id}_{filename}")
        proof_file.save(file_path)
        proof_url = file_path

    submission = ChallengeSubmission(
        user_id=user.id,
        challenge_id=challenge.id,
        proof_url=proof_url,
        status="pending",
        submitted_at=datetime.utcnow()
    )
    db.session.add(submission)
    db.session.commit()

    return jsonify({"message": "Challenge submitted successfully. Awaiting approval."}), 201


# ─────────────────────────────────────────────
# Submit Local Challenge (no EcoChallenge DB row needed)
# Called by Challenges.jsx with module name + task
# ─────────────────────────────────────────────
@challenges_bp.route("/submit-local", methods=["POST"])
@jwt_required()
def submit_local_challenge():
    """
    Submits a local challenge (where there is no EcoChallenge DB row).
    Stores submission with challenge_id = None (or gets/creates a matching one).

    Form-data:
    - module  (str) - module name e.g. "Climate Change"
    - task    (str) - task description
    - quiz_score (str, optional)
    - proof   (file, optional)
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    module_name = request.form.get("module", "").strip()
    task = request.form.get("task", "").strip()
    quiz_score = request.form.get("quiz_score", "0")

    if not module_name:
        return jsonify({"error": "module name is required"}), 400

    # Try to find or create an EcoChallenge row for this module
    challenge = EcoChallenge.query.filter_by(title=module_name).first()
    if not challenge:
        # Create a placeholder EcoChallenge so we have a foreign key
        challenge = EcoChallenge(
            title=module_name,
            description=task or f"{module_name} eco challenge",
            instructions=task or "Complete the eco challenge task",
            points=50,
            active=True
        )
        db.session.add(challenge)
        db.session.flush()  # get the id without full commit

    # Handle file upload
    proof_url = None
    proof_file = request.files.get("proof")
    if proof_file and proof_file.filename:
        if not allowed_file(proof_file.filename):
            return jsonify({"error": "Invalid file type. Use jpg, png, gif or pdf."}), 400
        filename = secure_filename(proof_file.filename)
        upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads/challenge_proofs")
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, f"user_{user_id}_{int(datetime.utcnow().timestamp())}_{filename}")
        proof_file.save(file_path)
        proof_url = file_path

    submission = ChallengeSubmission(
        user_id=user.id,
        challenge_id=challenge.id,
        proof_url=proof_url,
        status="pending",
        submitted_at=datetime.utcnow()
    )
    db.session.add(submission)
    db.session.commit()

    return jsonify({
        "message": f"'{module_name}' challenge submitted! Awaiting teacher approval.",
        "submission_id": submission.id,
        "quiz_score": quiz_score
    }), 201


# ─────────────────────────────────────────────
# Get All Submissions (for teacher/admin Submissions.jsx)
# ─────────────────────────────────────────────
@challenges_bp.route("/submissions", methods=["GET"])
@jwt_required()
def get_all_submissions():
    """
    Returns all submissions. Only teachers/admins see all; students see their own.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.role in ["teacher", "admin"]:
        submissions = ChallengeSubmission.query.order_by(ChallengeSubmission.submitted_at.desc()).all()
    else:
        submissions = ChallengeSubmission.query.filter_by(user_id=user_id).order_by(ChallengeSubmission.submitted_at.desc()).all()

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


# ─────────────────────────────────────────────
# Update Submission Status (approve/reject from Submissions.jsx)
# ─────────────────────────────────────────────
@challenges_bp.route("/submissions/<int:submission_id>", methods=["PUT"])
@jwt_required()
def update_submission_status(submission_id):
    """
    Updates a submission status to Approved or Rejected.
    Only teachers/admins can do this.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role not in ["teacher", "admin"]:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    new_status = (data.get("status") or "").lower()

    if new_status not in ["approved", "rejected"]:
        return jsonify({"error": "Status must be 'Approved' or 'Rejected'"}), 400

    submission = ChallengeSubmission.query.get(submission_id)
    if not submission:
        return jsonify({"error": "Submission not found"}), 404

    submission.status = new_status
    submission.reviewed_at = datetime.utcnow()

    if new_status == "approved":
        challenge = EcoChallenge.query.get(submission.challenge_id)
        student = User.query.get(submission.user_id)
        if challenge and student:
            student.eco_points += challenge.points
            db.session.commit()
            # Auto-award any badges the student now qualifies for
            try:
                from routes.users import award_badges_for_user
                award_badges_for_user(student)
            except Exception as badge_err:
                print(f"Badge award error (non-critical): {badge_err}")
    else:
        db.session.commit()

    return jsonify({"message": f"Submission {new_status}", "id": submission.id}), 200


# ─────────────────────────────────────────────
# Get My Submissions (student view)
# ─────────────────────────────────────────────
@challenges_bp.route("/my-submissions", methods=["GET"])
@jwt_required()
def get_my_submissions():
    """
    Returns the authenticated user's challenge submissions,
    including the module/challenge title so the frontend can
    mark challenges as already submitted.
    """
    user_id = get_jwt_identity()
    submissions = ChallengeSubmission.query.filter_by(user_id=user_id).all()

    result = []
    for sub in submissions:
        challenge = EcoChallenge.query.get(sub.challenge_id) if sub.challenge_id else None
        result.append({
            "id": sub.id,
            "challenge_id": sub.challenge_id,
            "module": challenge.title if challenge else None,
            "proof_url": sub.proof_url,
            "status": sub.status,
            "submitted_at": sub.submitted_at.isoformat()
        })
    return jsonify(result), 200

