from flask import Flask
from .config import config
from .extensions import db, ma, cors, migrate

def create_app(config_name='default'):
    """
    Application Factory: Crea y configura la instancia de la app.
    """
    app = Flask(__name__)
    
    # 1. Cargar configuración
    app.config.from_object(config[config_name])

    # 2. Inicializar extensiones
    db.init_app(app)
    ma.init_app(app)
    
    # Usamos la lista de orígenes desde app.config
    cors.init_app(app, 
                  resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}}, 
                  supports_credentials=True)
    
    migrate.init_app(app, db)

    # 3. Registrar Blueprints (nuestros módulos de rutas)
    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    # 4. Crear tablas de la base de datos (si no existen)
    # Con PostgreSQL, es mejor confiar 100% en las migraciones.
    # Puedes comentar o dejar esta línea, pero las migraciones son la vía correcta.
    with app.app_context():
        db.create_all() # Esto solo crea tablas si NO existen

    return app