import os
from dotenv import load_dotenv

# Carga las variables de entorno desde .env
load_dotenv()

from app import create_app

# Obtiene el nombre de la configuración (development, production) desde las variables de entorno
config_name = os.getenv('FLASK_ENV', 'production')
print(f"Starting app with config: {config_name}")
app = create_app(config_name)

if __name__ == '__main__':
    # Lee el puerto desde el .env, con 5000 como default
    port = int(os.environ.get('PORT', 5000))
    app.run(port=port)