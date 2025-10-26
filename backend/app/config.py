import os
from app.services.predefined_tags import TAG_LIST # Importamos los tags

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Configuración base."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'una-clave-secreta-por-defecto'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    
    CORS_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '*').split(',')
    
    PREDEFINED_TAGS = TAG_LIST

class DevelopmentConfig(Config):
    """Configuración de desarrollo."""
    DEBUG = True

class ProductionConfig(Config):
    """Configuración de producción."""
    DEBUG = False

# Un diccionario para acceder a las clases de config por nombre
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}