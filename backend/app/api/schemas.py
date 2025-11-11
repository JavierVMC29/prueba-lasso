from app.extensions import ma
from app.api.models import Grant, Tag
from marshmallow import fields


# Esquema para validar el JSON de ENTRADA
class GrantInputSchema(ma.Schema):
    name = fields.Str(required=True)
    description = fields.Str(required=True)


# Esquema para serializar (convertir a JSON) un objeto Tag
class TagSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Tag
        fields = ("name",)  # Solo queremos mostrar el nombre


# Esquema para serializar (convertir a JSON) un objeto Grant
class GrantOutputSchema(ma.SQLAlchemyAutoSchema):
    # Anidamos el esquema de Tag para que se muestren los tags
    # tags = fields.Nested(TagSchema, many=True)

    # Requisito: "tags": ["tag1", "tag2"] (una lista de strings)
    tags = fields.Method("get_tag_names")

    class Meta:
        model = Grant
        fields = ("id", "name", "description", "tags")
        load_instance = True

    def get_tag_names(self, obj):
        # obj es la instancia del modelo Grant
        return [tag.name for tag in obj.tags]


# Instancias de los esquemas para usarlos
grant_input_schema = GrantInputSchema()
grants_input_schema = GrantInputSchema(many=True)  # Para una lista de grants

grant_output_schema = GrantOutputSchema()
grants_output_schema = GrantOutputSchema(many=True)
