import os
from app.services.predefined_tags import TAG_LIST

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Configuración base."""
    FLASK_ENV = os.environ.get('FLASK_ENV', 'production')
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'una-clave-secreta-por-defecto'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    
    CORS_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '*').split(',')

    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    # Set the default tagging method ('simple' or 'llm')
    TAGGING_METHOD = os.environ.get('TAGGING_METHOD', 'simple')
    
    
    PREDEFINED_TAGS = TAG_LIST

class DevelopmentConfig(Config):
    """Configuración de desarrollo."""
    DEBUG = True

class ProductionConfig(Config):
    """Configuración de producción."""
    DEBUG = False

# A dictionary to easily access configurations
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}