import datetime
from flask import jsonify, request

def success_response(data, message="Success", status_code=200):
    """
    Generates a standardized success response.
    """
    return jsonify({
        "status": "SUCCESS",
        "statusCode": status_code,
        "message": message,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "path": request.path,
        "data": data,
        "errorCode": None
    }), status_code

def error_response(message, error_code, status_code):
    """
    Generates a standardized error response.
    """
    # It's important to log the error on the server
    # (We will do this in the global error handler)
    return jsonify({
        "status": "ERROR",
        "statusCode": status_code,
        "message": message,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "path": request.path,
        "data": None,
        "errorCode": error_code
    }), status_code