#learning modules Routes for Ecolearn

from flask import Blueprint,jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import LearningModule, QuizQuestion
from extensions import db

#Blueprint Initialization
modules_bp = Blueprint("modules",__name__)

#get all learning modules
@modules_bp.route("/",methods=["GET"])
@jwt_required()
def get_all_modules():
    modules = LearningModule.query.all()
    result = []
    for module in modules:
        result.append({
            "id":module.id,
            "title":module.title,
            "description":module.description,
            "difficulty":module.difficulty,
            "points":module.points
        })
        return jsonify(result), 200
    #get single modules + quiz questions
    @modules_bp.route("/<int:module_id>",methods=["GET"])
    @jwt_required()
    def get_module_detail(module_id):
        module = LearningModule.query.get(module_id)
        if not module:
            return jsonify({"error":"Module not found"}), 404
        quizzes = QuizQuestion.query.filter_by(module_id=module.id.all()
                                               quiz_data =[]
                                               for quiz in quizzes:
                                                quiz_data.append({
                                                    "id":quiz.id,
                                                    "question":quiz.question,
                                                    "option_a":quiz.option_a,
                                                    "option_b":quiz.option_b,
                                                    "option_c":quiz.option_c,
                                                    "option_d":quiz.option_d,
                                                    #correct_option intentionally NOT sent
                                                }))
        response = {
            "id":module.id,
            "title":module.title,
            "description":module.description,
            "difficulty":module.difficulty,
            "points":module.points,
            "quizzes":quiz_data
        }

        return jsonify(response),200
        
        
