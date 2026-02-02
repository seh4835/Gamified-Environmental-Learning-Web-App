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

#Quiz Attempt Model
class QuzAttempt(db.Model):
    __tablename__="quiz_attempts"
    id=db.Column(db.Integer,primary_key=True)
    user_id= db.Column(db.Integer,db.ForeignKey("users.id"), nullable=False)
    module_id=db.Column(db.Integer,db.ForeignKey("learning_modules.id"), nullable="False")

    score=db.Column(db.Integer, nullable=False)
    attempted_at= db.Column(db.DateTime, default=datetime.now(timezone.utc))

    def __repr__(self):
        return f"<QuizAttempt User:{self.user_id} Module:{self.module_id}>"
    
#Eco Challenge Model
class EcoChallenge(db.Model):
    __tablename__="eco_challenges"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)

    points = db.Column(db.Integer, default=20)
    active = db.Column(db.Boolean, default=True)

    submissions = db.relationship("ChallengeSubmission", backref="challenge", lazy=True)

    def __repr__(self):
        return f"<EcoChallenge {self.title}>"
    
#Challenge Submission Model
class ChallengeSubmission(db.Model):
    __tablename__ = "challenge_submissions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    challenge_id = db.Column(db.Integer, db.ForeignKey("eco_challenges.id"), nullable=False)

    proof_url = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default="pending")  # pending / approved / rejected

    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f"<Submission User:{self.user_id} Challenge:{self.challenge_id}>"
    
#Badge Model
class Badge(db.Model):
    __tablename__ = "badges"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    required_points = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<Badge {self.name}>"
    
#User Badge Mapping Model
class UserBadge(db.Model):
    __tablename__ = "user_badges"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey("badges.id"), nullable=False)

    earned_at = db.Column(db.DateTime, default=datetime.utcnow)

    badge = db.relationship("Badge")

    def __repr__(self):
        return f"<UserBadge User:{self.user_id} Badge:{self.badge_id}>"