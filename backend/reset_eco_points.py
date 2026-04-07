from app import app
from extensions import db
from models import User, QuizAttempt, ChallengeSubmission

# This script will reset eco_points to 0 for users who have not completed any quizzes or approved challenges.
def reset_eco_points_for_inactive_users():
    with app.app_context():
        users = User.query.all()
        print("--- BEFORE RESET ---")
        for user in users:
            print(f"User: {user.name} | Email: {user.email} | Eco Points: {user.eco_points}")

        updated = 0
        for user in users:
            # Count quizzes and approved challenges
            quiz_count = QuizAttempt.query.filter_by(user_id=user.id).count()
            challenge_count = ChallengeSubmission.query.filter_by(user_id=user.id, status="approved").count()
            if quiz_count == 0 and challenge_count == 0 and user.eco_points != 0:
                print(f"Resetting eco points for {user.name} ({user.email}) from {user.eco_points} to 0")
                user.eco_points = 0
                updated += 1
        db.session.commit()
        print(f"Eco points reset for {updated} inactive users.")

        print("--- AFTER RESET ---")
        users = User.query.all()
        for user in users:
            print(f"User: {user.name} | Email: {user.email} | Eco Points: {user.eco_points}")

if __name__ == "__main__":
    reset_eco_points_for_inactive_users()
