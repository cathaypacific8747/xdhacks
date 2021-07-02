from flask import Blueprint, render_template, request, jsonify
from werkzeug.exceptions import HTTPException
import traceback

err = Blueprint('error_handlers', __name__)

class InvalidState(HTTPException):
    code = 403
    description = 'Invalid CSRF token. Please disable ad-blockers or script-blockers if you have them installed, or try logging in again.'

class GoogleConnectionError(HTTPException):
    code = 500
    description = "An error occurred when contacting Google's servers. Please try again later."

class NoBookId(HTTPException):
    code = 404
    description = "No book id supplied."

@err.app_errorhandler(Exception)
def handle_error(e):

    if isinstance(e, HTTPException):
        code = e.code
        description = e.description
    else:
        # debug non 404 errors only
        print('\033[31m', end=None)
        traceback.print_exc()
        print('\033[0m')

        code = '500'
        description = 'Internal Server Error'

    if "api" in request.path:
        return jsonify({
            "status": "error",
            "code": code,
            "message": description,
        }), code
    else:
        return render_template('error.html', code=code, description=description), code