#!/usr/bin/env python3
"""
Seed test users into the database with eco points
"""
from app import app
from extensions import db
from models import User
from werkzeug.security import generate_password_hash

test_users = []

def seed_users():
    with app.app_context():
        # No default/test users or eco points will be seeded.
        print("No users or eco points seeded. Script is now a no-op.")

if __name__ == "__main__":
    seed_users()
