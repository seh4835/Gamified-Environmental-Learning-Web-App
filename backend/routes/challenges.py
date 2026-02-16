"""
Eco Challenge Routes for EcoLearn

Handlea:
Listing available eco-challenges
Submitting challenge proof (image/text)
 Viewing user's own submissions

All routes are prefixed with-/api/challenges
"""

import os
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from extensions import db
from models import EcoChallenge, ChallengeSubmission, User
# Blueprint Initialization

challenges_bp = Blueprint("challenges", __name__)

# Helper: Allowed File Extension Check

def allowed_file(filename):
    allowed_extensions = current_app.config.get("ALLOWED_EXTENSIONS", {"png", "jpg", "jpeg"})
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_extensions


# Get All Active Eco Challenges

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
# Submit Challenge Proof

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
    # Handle File Upload (Optional)

    if proof_file:
        if not allowed_file(proof_file.filename):
            return jsonify({"error": "Invalid file type"}), 400

        filename = secure_filename(proof_file.filename)
        upload_folder = current_app.config["UPLOAD_FOLDER"]

        os.makedirs(upload_folder, exist_ok=True)

        file_path = os.path.join(upload_folder, f"user_{user_id}_{filename}")
        proof_file.save(file_path)

        proof_url = file_path