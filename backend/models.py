from datetime import datetime, timezone
from extensions import db

# User Model
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), default="student")
    institution = db.Column(db.String(100), nullable=False)
    eco_points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # relationships
    quiz_attempts = db.relationship("QuizAttempt", backref='user', lazy=True, cascade="all, delete-orphan")
    challenge_submissions = db.relationship("ChallengeSubmission", backref='user', lazy=True, cascade="all, delete-orphan")
    user_badges = db.relationship("UserBadge", backref='user', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.email}>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'institution': self.institution,
            'eco_points': self.eco_points,
            'created_at': self.created_at.isoformat()
        }


# Learning Module Model
class LearningModule(db.Model):
    __tablename__ = "learning_modules"

    id = db.Column(db.BigInteger, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(50), default="beginner")
    points = db.Column(db.Integer, default=10)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    quiz_questions = db.relationship("QuizQuestion", backref="module", lazy=True, cascade="all, delete-orphan")
    quiz_attempts = db.relationship("QuizAttempt", backref="module", lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<LearningModule {self.title}>"

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'difficulty': self.difficulty,
            'points': self.points,
            'created_at': self.created_at.isoformat()
        }


# Quiz Question Model
class QuizQuestion(db.Model):
    __tablename__ = "quiz_questions"

    id = db.Column(db.BigInteger, primary_key=True)
    module_id = db.Column(db.BigInteger, db.ForeignKey("learning_modules.id"), nullable=False)
    question = db.Column(db.Text, nullable=False)
    option_a = db.Column(db.String(255), nullable=False)
    option_b = db.Column(db.String(255), nullable=False)
    option_c = db.Column(db.String(255), nullable=False)
    option_d = db.Column(db.String(255), nullable=False)
    correct_option = db.Column(db.String(1), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<QuizQuestion {self.id}>"

    def to_dict(self):
        return {
            'id': self.id,
            'module_id': self.module_id,
            'question': self.question,
            'options': {
                'a': self.option_a,
                'b': self.option_b,
                'c': self.option_c,
                'd': self.option_d
            },
            'correct_option': self.correct_option
        }


# Quiz Attempt Model
class QuizAttempt(db.Model):
    __tablename__ = "quiz_attempts"

    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey("users.id"), nullable=False)
    module_id = db.Column(db.BigInteger, db.ForeignKey("learning_modules.id"), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    attempted_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<QuizAttempt User:{self.user_id} Module:{self.module_id}>"

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'module_id': self.module_id,
            'score': self.score,
            'attempted_at': self.attempted_at.isoformat()
        }


# Eco Challenge Model
class EcoChallenge(db.Model):
    __tablename__ = "eco_challenges"

    id = db.Column(db.BigInteger, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    points = db.Column(db.Integer, default=20)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    submissions = db.relationship("ChallengeSubmission", backref="challenge", lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<EcoChallenge {self.title}>"

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'instructions': self.instructions,
            'points': self.points,
            'active': self.active,
            'created_at': self.created_at.isoformat()
        }


# Challenge Submission Model
class ChallengeSubmission(db.Model):
    __tablename__ = "challenge_submissions"

    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey("users.id"), nullable=False)
    challenge_id = db.Column(db.BigInteger, db.ForeignKey("eco_challenges.id"), nullable=False)
    proof_url = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default="pending")  # pending / approved / rejected
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<ChallengeSubmission User:{self.user_id} Challenge:{self.challenge_id}>"

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'challenge_id': self.challenge_id,
            'proof_url': self.proof_url,
            'status': self.status,
            'submitted_at': self.submitted_at.isoformat(),
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None
        }


# Badge Model
class Badge(db.Model):
    __tablename__ = "badges"

    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    required_points = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    user_badges = db.relationship("UserBadge", backref="badge", lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Badge {self.name}>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'required_points': self.required_points
        }


# User Badge Mapping Model
class UserBadge(db.Model):
    __tablename__ = "user_badges"

    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey("users.id"), nullable=False)
    badge_id = db.Column(db.BigInteger, db.ForeignKey("badges.id"), nullable=False)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<UserBadge User:{self.user_id} Badge:{self.badge_id}>"

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'badge_id': self.badge_id,
            'earned_at': self.earned_at.isoformat(),
            'badge': self.badge.to_dict() if self.badge else None
        }
    
