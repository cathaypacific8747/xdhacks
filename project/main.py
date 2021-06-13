from project.auth import login
from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import login_required, current_user
from flask.helpers import flash
from . import db
from .models import User

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name, balance=current_user.balance)

@main.route('/addcredits')
@login_required
def addcredits():
    user = User.query.filter_by(email=current_user.email).first()
    if user:
        try:
            user.balance = user.balance + 10 # not using += to avoid race conditions.
            db.session.commit()
            return {'success': True}
        except:
            pass
    return {'success': False}

@main.route('/resetcredits')
@login_required
def resetcredits():
    user = User.query.filter_by(email=current_user.email).first()
    if user:
        try:
            user.balance = 0
            db.session.commit()
            return {'success': True}
        except:
            pass
    return {'success': False}

@main.route('/market')
@login_required
def market():
    return render_template('market.html', name=current_user.name)