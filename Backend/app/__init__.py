from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()


def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    
    # Configure CORS - Simple and robust configuration
    # This allows all origins, methods, and headers for development
    CORS(app, 
         resources={r"/api/*": {
             "origins": "*",  # Allow all origins for development
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
             "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
             "expose_headers": ["Content-Type"],
             "supports_credentials": False,
             "max_age": 3600
         }},
         supports_credentials=False)
    
    # Register blueprints
    from app.routes import bp
    app.register_blueprint(bp)
    
    from app.auth import auth_bp
    app.register_blueprint(auth_bp)
    
    from app.knapsack_routes import knapsack_bp
    app.register_blueprint(knapsack_bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

