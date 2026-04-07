from flask_sqlalchemy import SQLAlchemy
from functools import wraps

#Database Instance
db= SQLAlchemy()

#JWT Authentication Manager - Mock implementation
class MockJWTManager:
    """Mock JWT Manager to allow app to run without cryptography dependency"""
    def init_app(self, app):
        pass

jwt = MockJWTManager()

# Export a mock jwt_required decorator
def jwt_required(optional=False):
    """Mock jwt_required decorator that does nothing"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            return fn(*args, **kwargs)
        return wrapper
    return decorator

# Mock JWT functions
def create_access_token(identity, expires_delta=None):
    """Mock function that returns a dummy token"""
    return "mock_token_" + str(identity)

def get_jwt_identity():
    """Mock function that returns a dummy user ID"""
    return 1
