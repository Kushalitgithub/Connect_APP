#!/usr/bin/env python3
"""
Bootstrap script to create the first admin account.
Run this script after setting up the database and before starting the application.
"""
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Add the app directory to the path so we can import our models
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from core.config import settings
from db.base import Base
from models.user import User, RoleEnum

# Initialize password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def create_admin():
    # Create database engine and session
    engine = create_engine(settings.DATABASE_URI)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    # Check if admin already exists
    admin = db.query(User).filter(User.role == RoleEnum.admin).first()
    if admin:
        print("Admin user already exists. Exiting.")
        return

    # Get admin details from user input
    email = input("Enter admin email: ")
    password = input("Enter admin password: ")

    # Create admin user
    hashed_password = get_password_hash(password)
    admin_user = User(
        email=email,
        hashed_password=hashed_password,
        role=RoleEnum.admin,
        is_active=True
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    print(f"Admin user created with ID: {admin_user.id}")

if __name__ == "__main__":
    create_admin()