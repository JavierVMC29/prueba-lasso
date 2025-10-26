from flask import Flask

from .config import config
from .extensions import db, ma, cors, migrate

def create_app(config_name='default'):
    """
    Application Factory: Crea y configura la instancia de la app.
    """
    app = Flask(__name__)
    
    # 1. Load config
    app.config.from_object(config[config_name])

    # 2. Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    
    # Use the CORS origins from config
    cors.init_app(app, 
                  resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}}, 
                  supports_credentials=True)
    
    migrate.init_app(app, db)

    # 3. Register blueprints
    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    # 4. Create database tables (if they don't exist)
    # With PostgreSQL, is better to use migrations.
    # You can comment this out if using migrations.
    with app.app_context():
        db.create_all() # Only create tables if they don't exist

    return app