# Student Grade Calculator

def get_grade_and_message(marks):
    if marks >= 90 and marks <= 100:
        return "A", "Excellent work! Keep shining!"
    elif marks >= 80:
        return "B", "Very Good! Keep it up!"
    elif marks >= 70:
        return "C", "Good effort! You can do even better!"
    elif marks >= 60:
        return "D", "You passed! Work harder next time!"
    else:
        return "F", "Don't give up! Try again with more practice!"
    
