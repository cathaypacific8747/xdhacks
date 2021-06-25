from flask import Blueprint, render_template

err = Blueprint('error_handlers', __name__)

@err.app_errorhandler(Exception)
def handle_error(e):
    try:
        helpMessage = e.helpMessage
    except:
        helpMessage = 'Please try again later.'
        # Yes, sorry for this crap.
    return render_template('error.html', code=e.code, description=e.description, helpMessage=helpMessage)