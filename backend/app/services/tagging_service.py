import re
from flask import current_app

import re
import json
from flask import current_app
from openai import OpenAI, OpenAIError

_openai_client = None

# --- NEW DISPATCHER FUNCTION ---

def tag_grant(description, grant_name):
    """
    Dispatches the tagging request to the method specified in the config.
    Falls back to 'simple' if 'llm' is configured but fails.
    """
    method = current_app.config.get('TAGGING_METHOD', 'simple')
    
    if method == 'llm':
        try:
            # Try to get tags from the LLM
            current_app.logger.debug("Using LLM tagger for tagging.")
            return _get_llm_tags(description, grant_name)
        except Exception as e:
            # If LLM tagging fails for any reason, log it and fall back
            current_app.logger.error(f"LLM tagging failed: {e}. Falling back to simple tagger.", exc_info=True)
            return simple_string_match_tagger(description, grant_name)
    
    # Default to simple string matching
    current_app.logger.debug("Using simple string match tagger for tagging.")
    return simple_string_match_tagger(description, grant_name)

# --- SIMPLE (DEFAULT) TAGGER ---

def simple_string_match_tagger(description, grant_name):
    """
    Performs a simple, case-insensitive string match against the
    grant description and name.
    """
    predefined_tags = current_app.config["PREDEFINED_TAGS"]
    found_tags = set()

    # Combine name and description for searching
    text_to_search = description.lower() + " " + grant_name.lower()

    for tag in predefined_tags:
        # Use regex \b (word boundary) to find the exact word/tag
        # re.escape handles tags with hyphens like 'cost-share'
        pattern = r"\b" + re.escape(tag.lower()) + r"\b"

        if re.search(pattern, text_to_search):
            found_tags.add(tag)

    return list(found_tags)

# --- LLM (ADVANCED) TAGGER ---

def _get_llm_tags(description, grant_name):
    """
    Uses the OpenAI API to assign tags.
    (Private function, called by tag_grant dispatcher)
    """
    global _openai_client

    api_key = current_app.config.get('OPENAI_API_KEY')
    if not api_key:
        current_app.logger.warning("OPENAI_API_KEY is not set. Falling back to simple tagger.")
        return simple_string_match_tagger(description, grant_name)
    
    if _openai_client is None:
        current_app.logger.info("Initializing OpenAI client for the first time.")
        try:
            _openai_client = OpenAI(api_key=api_key)
        except Exception as e:
             current_app.logger.error(f"Failed to initialize OpenAI client: {e}", exc_info=True)
             return simple_string_match_tagger(description, grant_name)

    client = _openai_client
    
    try:
        client = OpenAI(api_key=api_key)
        
        predefined_tags_str = ", ".join(current_app.config['PREDEFINED_TAGS'])

        system_prompt = f"""
        You are an expert grant categorization system. Your task is to analyze a grant
        and assign relevant tags from a predefined list.
        
        RULES:
        1. You MUST only use tags from this exact list:
           {predefined_tags_str}
        2. You MUST return a valid JSON object in the format: {{"tags": ["tag1", "tag2", ...]}}
        3. Do not include any tags that are not in the list.
        4. Do not include any explanation or other text.
        5. If no tags from the list are relevant, return an empty list: {{"tags": []}}
        """
        
        user_prompt = f"""
        Please categorize the following grant:
        Grant Name: {grant_name}
        Description: {description}
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini", # Fast, cheap, and effective
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1 # Low temperature for more predictable, less "creative" results
        )
        
        # Parse the JSON response
        response_content = response.choices[0].message.content
        if not response_content:
            raise ValueError("OpenAI returned an empty response.")
            
        data = json.loads(response_content)
        
        if "tags" not in data or not isinstance(data["tags"], list):
             raise ValueError(f"LLM returned invalid JSON structure: {data}")
        
        # Final validation: Ensure all tags are from the predefined list
        valid_tags = set(current_app.config['PREDEFINED_TAGS'])
        final_tags = [tag for tag in data["tags"] if tag in valid_tags]
        
        return final_tags
        
    except OpenAIError as e:
        current_app.logger.error(f"OpenAI API error: {e}", exc_info=True)
        # Fallback to simple tagger on API failure
        return simple_string_match_tagger(description, grant_name)
    except (json.JSONDecodeError, ValueError) as e:
        current_app.logger.error(f"Failed to parse LLM response: {e}", exc_info=True)
        # Fallback to simple tagger on parsing failure
        return simple_string_match_tagger(description, grant_name)