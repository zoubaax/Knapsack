import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    # MySQL database URL format: mysql+pymysql://user:password@host:port/database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+pymysql://root:password@localhost:3306/knapsack'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # CORS settings - default includes common development ports
    cors_origins_env = os.environ.get('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173')
    if cors_origins_env.strip() == '*':
        CORS_ORIGINS = '*'
    else:
        CORS_ORIGINS = [origin.strip() for origin in cors_origins_env.split(',') if origin.strip()]
    
    # Server settings
    HOST = os.environ.get('HOST', '127.0.0.1')
    PORT = int(os.environ.get('PORT', 5000))
    DEBUG = os.environ.get('FLASK_ENV') == 'development'


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

