from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import QuizQuestion, QuizAttempt, User, LearningModule
# Blueprint Initialization

quizzes_bp = Blueprint("quizzes", __name__)

# Submit Quiz Answers

@quizzes_bp.route("/submit", methods=["POST"])
@jwt_required()
def submit_quiz():
    """
    Submits quiz answers for a learning module.

    Expected JSON:
    {
        "module_id": 1,
        "answers": {
            "1": "a",
            "2": "c",
            "3": "b"
        }
    }

    Returns:
    - Score
    - Points earned
    """

    user_id = get_jwt_identity()
    data = request.get_json()
    # Basic Valdation
    if not data or "module_id" not in data or "answers" not in data:
        return jsonify({"error": "module_id and answers are required"}), 400
    
    module = LearningModule.query.get(data["module_id"])
    if not module:
        return jsonify({"error": "Learning module not found"}), 404
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    answers = data["answers"]
    # Fetch Quiz Questions

    questions = QuizQuestion.query.filter_by(module_id=module.id).all()

    if not questions:
        return jsonify({"error": "No quiz questions found for this module"}), 404

    # Score Calculation

    score = 0
    total_questions = len(questions)

    for question in questions:
        question_id = str(question.id)
        if question_id in answers:
            if answers[question_id].lower() == question.correct_option.lower():
                score += 1
# Save Quiz Attempt

    quiz_attempt = QuizAttempt(
        user_id=user.id,
        module_id=module.id,
        score=score
    )

    db.session.add(quiz_attempt)

    # Update Eco Points

    points_earned = module.points if score == total_questions else int(
        (score / total_questions) * module.points
    )

    user.eco_points += points_earned

    db.session.commit()

    return jsonify({
        "message": "Quiz submitted successfully",
        "score": score,
        "total_questions": total_questions,
        "points_earned": points_earned,
        "total_eco_points": user.eco_points
    }), 200 