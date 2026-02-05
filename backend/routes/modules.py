#learning modules Routes for Ecolearn

from flask import Blueprint,jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import LearningModule, QuizQuestion
from extensions import db

#Blueprint Initialization
modules_bp = Blueprint("modules",__name__)