import os
from datetime import timedelta
from dotenv import load_dotenv

#load variables from .env file (only once , globally)
load_dotenv()

class BaseConfig:
#core flask configuration
SECRET_KEY = os.getenv("SECRET_KEY","eco-learn-secret-key")

#database configuration
SQLALCHEMY_DATABASE_URI = os.getenv(
    "DATABASE_URL",
    "sqlite:///ecolearn.db"
)
SQLALCHEMY_TRACK_MODIFICATION = False

#JWT configuration
JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "eco-learn-jwt-secret-key"
)
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=6)

#file upload configuration
UPLOAD_FOLDER = os.getenv(
    "UPLOAD_FOLDER",
    "uploads/challenge_proofs"
)
MAX_CONTENT_LENGTH = 5 * 1024 * 1024 #5 MB limit 
ALLOWED_EXTENSIONS = {"png","jpg","jpeg"}

#Apllication metadata
APP_NAME = "EcoLearn"
APP_VERSION = "1.0.0"
