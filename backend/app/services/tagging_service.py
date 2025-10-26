import re
from flask import current_app


def simple_string_match_tagger(description, grant_name):
    """
    Realiza un simple string matching (case-insensitive) contra la
    descripción y el nombre del grant.
    """
    predefined_tags = current_app.config["PREDEFINED_TAGS"]
    found_tags = set()

    # Combinamos nombre y descripción para la búsqueda
    text_to_search = description.lower() + " " + grant_name.lower()

    for tag in predefined_tags:
        # Usamos regex \b (word boundary) para buscar la palabra/tag exacto
        # re.escape maneja tags con guiones como 'cost-share'
        pattern = r"\b" + re.escape(tag.lower()) + r"\b"

        if re.search(pattern, text_to_search):
            found_tags.add(tag)

    return list(found_tags)


def get_llm_tags(description, grant_name):
    """
    (Opcional) Aquí podrías implementar la lógica de LLM.

    import openai
    openai.api_key = "..."

    predefined_tags_str = ", ".join(current_app.config['PREDEFINED_TAGS'])

    prompt = f"Analiza la siguiente subvención:
    Nombre: {grant_name}
    Descripción: {description}

    Asigna solo tags de la siguiente lista: {predefined_tags_str}

    Responde solo con una lista de Python de los tags asignados.
    Ejemplo: ['agriculture', 'soil']
    "

    # ... llamada a la API de OpenAI ...
    # ... parsear la respuesta ...

    return parsed_tags_list
    """
    pass
