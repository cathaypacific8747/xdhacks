from flask import Blueprint, render_template, Response, send_from_directory, current_app
from flask_login import login_required
import os
from htmlmin import minify

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return minify(render_template('index.html', help='master'), remove_empty_space=True)

@main.route('/robots.txt')
def noindex():
    r = Response(response="User-Agent: *\nDisallow: /\n", status=200, mimetype="text/plain")
    r.headers["Content-Type"] = "text/plain; charset=utf-8"
    return r

@main.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(current_app.root_path, 'static/img/favicon'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@main.route('/welcome')
@login_required
def welcome():
    return minify(render_template('welcome.html', help='master'), remove_empty_space=True)

@main.route('/settings')
@main.route('/profile/<string:userid>')
@login_required
def settings(userid=None):
    if userid:
        return minify(render_template('settings_readonly.html', userid=userid, help='master'), remove_empty_space=True)
    return minify(render_template('settings.html', help='settings'), remove_empty_space=True)

@main.route('/sell')
@login_required
def sell():
    return minify(render_template('sell.html', help='sell'), remove_empty_space=True)

@main.route('/listings')
@main.route('/listings/<string:userid>')
@login_required
def listings(userid=None):
    if userid:
        return minify(render_template('listings_readonly.html', userid=userid, help='master'), remove_empty_space=True)
    return minify(render_template('listings.html', help='mylistings'), remove_empty_space=True)

@main.route('/market')
@main.route('/market/<string:bookid>')
@login_required
def market(bookid=None):
    if bookid:
        return minify(render_template('market_detail.html', bookid=bookid, help='market_detail'), remove_empty_space=True)
    return minify(render_template('market.html', help='market'), remove_empty_space=True)

@main.route('/dashboard')
@login_required
def dashboard():
    return minify(render_template('dashboard.html', help='dashboard_messages'), remove_empty_space=True)

@main.route('/help')
def help():
    return minify(render_template('help.html', help='master'), remove_empty_space=True)

@main.route('/about-us')
def aboutus():
    return minify(render_template('aboutus.html', help='master'), remove_empty_space=True)

@main.route('/terms-of-use')
def tos():
    return minify(render_template('tos.html', help='master'), remove_empty_space=True)

@main.route('/privacy-notice')
def privacy():
    return minify(render_template('privacy.html', help='master'), remove_empty_space=True)