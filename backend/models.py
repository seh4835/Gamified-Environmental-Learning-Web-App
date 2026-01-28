from datetime import datetime, timezone
from extensions import db

#User Model
class User(db.Model):
    __tablename__= "users"

    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(100), nullable=False)
    email=db.Column(db.String(120), unique=True, nullable=False)
    password=db.Column(db.String(200), nullable=False)

    role=db.Column(db.String(50), default="student")
    institution=db.Column(db.String(100), nullable=False)

    eco_points=db.Column(db.Integer, default=0)
    created_at=db.Column(db.Datetime, default=datetime.now(timezone.utc))
    
    #relationships
    quiz_attempts=db.relationship("QuizAttempt", backref='user', lazy=True)
    challenge_submissions=db.relationship("ChallengeSubmission", backref='user', lazy=True)
    user_bages=db.relationship("UserBadge", backref='user', lazy=True)

    def __repr__(self):
        return f"<User{self.email}>"