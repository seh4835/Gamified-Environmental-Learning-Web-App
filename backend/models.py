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

#Learning Module Model
class LearningModule(db.Model):
    __tablename__="learning modules"

    id=db.Column(db.Integer,primary_key=True)
    title=db.Column(db.String(150), nullable=False)
    description=db.Column(db.Text, nullable=False)
    difficulty=db.Column(db.String(50), default="beginner")
    points=db.Column(db.Integer, default=10)

    quizzes=db.relationship("QuizQuestion", backref="module", lazy=True)

    def __repr__(self):
        return f"<Module{self.title}>"
    
#Quiz Question Model
class QuizQustion(db.Model):
    __tablename__="quiz_questions"
    id=db.Column(db.Integer,primary_key=True)
    module_id=db.Column(db.Integer, db.ForeignKey("learning_modules.id"), nullable=False)

    question=db.Column(db.Text, primary_key=True)
    option_a=db.Column(db.String(255), nullable=False)
    option_b=db.Column(db.String(255), nullable=False)
    option_c=db.Column(db.String(255), nullable=False)
    option_d=db.Column(db.String(255), nullable=False)
    correct_option=db.Column(db.String(1), nullable=False)

    def __repr__(self):
        return f"<QuizQuestion{self.id}>"