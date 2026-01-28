from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

#Database Instance
db= SQLAlchemy()

#JWT Authentication Manager
jwt= JWTManager()
