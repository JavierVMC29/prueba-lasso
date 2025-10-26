from flask import Blueprint

api = Blueprint('api', __name__)

# Importamos las rutas al final para evitar importaciones circulares
from . import routes