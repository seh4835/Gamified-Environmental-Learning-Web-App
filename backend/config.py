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
