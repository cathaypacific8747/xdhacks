from project.auth import login
from flask import Blueprint, render_template, redirect, url_for, request, current_app
from flask_login import login_required, current_user
from flask.helpers import flash

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/settings')
@main.route('/profile/<string:userid>')
@login_required
def settings(userid=None):
    if userid:
        return render_template('settings_readonly.html', userid=userid)
    return render_template('settings.html')

@main.route('/sell')
@login_required
def sell():
    return render_template('sell.html')

@main.route('/listings')
@main.route('/listings/<string:userid>')
@login_required
def listings(userid=None):
    if userid:
        return render_template('listings_readonly.html', userid=userid)
    return render_template('listings.html')

@main.route('/market/')
@main.route('/market/<string:bookid>')
@login_required
def market(bookid=None):
    if bookid:
        return render_template('market_detail.html', bookid=bookid)
    return render_template('market.html')

# @main.route('/market/<string:bookid>')
# @login_required
# def offer(bookid):
#     return render_template('market_detail.html', bookid=bookid)