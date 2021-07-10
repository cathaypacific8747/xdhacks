from project.auth import login
from flask import Blueprint, render_template, redirect, url_for, request, current_app
from flask_login import login_required, current_user
from flask.helpers import flash

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/settings')
@login_required
def settings():
    return render_template('settings.html')

@main.route('/sell')
@login_required
def sell():
    return render_template('sell.html')

@main.route('/listings')
@login_required
def listings():
    return render_template('listings.html')

@main.route('/market')
@login_required
def market():
    return render_template('market.html')