from flask import Blueprint, jsonify, request
from extensions import jwt_required, get_jwt_identity
from models import LearningModule, QuizQuestion, User, QuizAttempt
from extensions import db

# Blueprint Initialization
modules_bp = Blueprint("modules", __name__)

# -------------------------------------------
# GET ALL LEARNING MODULES
# -------------------------------------------
@modules_bp.route("/", methods=["GET"])
@jwt_required()
def get_all_modules():
    modules = LearningModule.query.order_by(LearningModule.id.asc()).all()

    result = [
        {
            "id": module.id,
            "title": module.title,
            "description": module.description,
            "difficulty": module.difficulty,
            "points": module.points
        }
        for module in modules
    ]

    return jsonify(result), 200


# GET SINGLE MODULE + QUIZZES
@modules_bp.route("/<int:module_id>", methods=["GET"])
@jwt_required()
def get_module_detail(module_id):
    module = LearningModule.query.filter_by(id=module_id).first()

    if not module:
        return jsonify({"error": "Module not found"}), 404

    quizzes = QuizQuestion.query.filter_by(module_id=module.id).all()

    quiz_data = [
        {
            "id": quiz.id,
            "question": quiz.question,
            "option_a": quiz.option_a,
            "option_b": quiz.option_b,
            "option_c": quiz.option_c,
            "option_d": quiz.option_d
            # correct_option intentionally not exposed
        }
        for quiz in quizzes
    ]

    response = {
        "id": module.id,
        "title": module.title,
        "description": module.description,
        "difficulty": module.difficulty,
        "points": module.points,
        "quizzes": quiz_data
    }

    return jsonify(response), 200


# -------------------------------------------
# COMPLETE MODULE - Award Eco Points
# -------------------------------------------
@modules_bp.route("/<int:module_id>/complete", methods=["POST"])
@jwt_required()
def complete_module(module_id):
    """
    Mark a module as completed and award eco points.
    Only awards points once per user per module.
    """
    user_id = get_jwt_identity()
    print(f"DEBUG: Attempting to complete module {module_id} for user {user_id}")
    
    # Get user
    user = User.query.get(user_id)
    if not user:
        print(f"DEBUG: User {user_id} not found in database")
        return jsonify({"error": "User not found"}), 404
    
    print(f"DEBUG: User found: {user.name} ({user.email})")
    
    # Get module
    module = LearningModule.query.get(module_id)
    if not module:
        print(f"DEBUG: Module {module_id} not found")
        return jsonify({"error": "Module not found"}), 404
    
    print(f"DEBUG: Module found: {module.title}")
    
    # Check if user already completed this module
    existing_completion = QuizAttempt.query.filter_by(
        user_id=user_id,
        module_id=module_id
    ).first()
    
    # If already completed, don't award points again
    if existing_completion:
        print(f"DEBUG: Module already completed by user {user_id}")
        return jsonify({
            "message": "Module already completed",
            "eco_points": 0,
            "total_eco_points": user.eco_points
        }), 200
    
    # Award eco points for module completion
    completion_points = module.points
    user.eco_points += completion_points

    print(f"DEBUG: Awarding {completion_points} points to user {user_id}")

    # Create a completion record (using QuizAttempt as a completion tracker)
    # Set score to -1 to indicate module completion, not a quiz attempt
    completion_record = QuizAttempt(
        user_id=user_id,
        module_id=module_id,
        score=-1  # Special value indicating module completion
    )

    db.session.add(completion_record)
    db.session.commit()

    # Auto-award any badges the user now qualifies for
    try:
        from routes.users import award_badges_for_user
        award_badges_for_user(user)
    except Exception as badge_err:
        print(f"Badge award error (non-critical): {badge_err}")

    print(f"DEBUG: Module completion recorded successfully")
    return jsonify({
        "message": f"Congratulations! {module.title} completed!",
        "eco_points": completion_points,
        "total_eco_points": user.eco_points,
        "module_title": module.title
    }), 200
