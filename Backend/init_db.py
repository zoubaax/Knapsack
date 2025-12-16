"""
Database initialization script
Run this script to create the database and tables
"""
from app import create_app, db
from config import Config

app = create_app(Config)

with app.app_context():
    # Create all tables
    db.create_all()
    print("Database tables created successfully!")
    print("You can now start the Flask application.")

