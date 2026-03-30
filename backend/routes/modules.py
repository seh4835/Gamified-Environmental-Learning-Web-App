from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import LearningModule, QuizQuestion
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
