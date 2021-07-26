from project.auth import login
from flask import Blueprint, render_template, Response, send_from_directory, current_app
from flask_login import login_required, current_user
from flask.helpers import flash
import os

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/robots.txt')
def noindex():
    r = Response(response="User-Agent: *\nDisallow: /\n", status=200, mimetype="text/plain")
    r.headers["Content-Type"] = "text/plain; charset=utf-8"
    return r

@main.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(current_app.root_path, 'static/img/favicon'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

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

@main.route('/market')
@main.route('/market/<string:bookid>')
@login_required
def market(bookid=None):
    if bookid:
        return render_template('market_detail.html', bookid=bookid)
    return render_template('market.html')

@main.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@main.route('/help')
@login_required
def help():
    return render_template('help.html')

@main.route('/welcome')
@login_required
def welcome():
    return render_template('welcome.html')

@main.route('/terms-of-use')
def tos():
    return render_template('tos.html')

@main.route('/privacy-notice')
def privacy():
    return render_template('privacy.html')