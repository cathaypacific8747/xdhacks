from flask import Blueprint, render_template

err = Blueprint('error_handlers', __name__)

@err.app_errorhandler(Exception)
def handle_error(e):
    # Yes, I understand this is bad.
    try:
        code = e.code
    except:
        code = '500'

    try:
        description = e.description
    except:
        description = 'Unknown Internal Server Error'

    try:
        helpMessage = e.helpMessage
    except:
        helpMessage = 'Please try again later.'
        # Yes, sorry for this crap.
    return render_template('error.html', code=code, description=description, helpMessage=helpMessage)