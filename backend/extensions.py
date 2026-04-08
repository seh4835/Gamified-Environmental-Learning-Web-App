from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from flask import request, g

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
    """Mock jwt_required decorator that extracts user ID from Authorization header"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")
            user_id = None
            
            print(f"DEBUG: Auth header: {auth_header}")
            
            if auth_header.startswith("Bearer "):
                token = auth_header[7:]  # Remove "Bearer " prefix
                print(f"DEBUG: Token: {token}")
                # Extract user_id from token (format: "mock_token_<user_id>")
                try:
                    if token.startswith("mock_token_"):
                        user_id = int(token.replace("mock_token_", ""))
                        print(f"DEBUG: Extracted user_id: {user_id}")
                    else:
                        print(f"DEBUG: Token doesn't start with mock_token_")
                        user_id = None
                except (ValueError, AttributeError) as e:
                    print(f"DEBUG: Error extracting user_id: {e}")
                    user_id = None
            
            if not optional and user_id is None:
                from flask import jsonify
                print(f"DEBUG: Unauthorized - no valid user_id")
                return jsonify({"error": "Unauthorized - missing or invalid token"}), 401
            
            # Store in Flask's g object (request context)
            g.user_id = user_id
            print(f"DEBUG: Stored user_id in g: {g.user_id}")
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator

# Mock JWT functions
def create_access_token(identity, expires_delta=None):
    """Mock function that returns a dummy token"""
    token = "mock_token_" + str(identity)
    print(f"DEBUG: Created token for user {identity}: {token}")
    return token

def get_jwt_identity():
    """Mock function that returns the current user ID from Flask's g object"""
    user_id = getattr(g, 'user_id', None)
    print(f"DEBUG: get_jwt_identity() returning: {user_id}")
    return user_id
