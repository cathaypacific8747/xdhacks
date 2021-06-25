from flask import Blueprint, render_template, redirect, url_for, request, session, current_app, abort
from flask.helpers import flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required
from .models import User
from . import db
import json
import requests
from .error_handler import InvalidState, GoogleConnectionError

auth = Blueprint('auth', __name__)
def get_google_provider_cfg():
    try:
        return requests.get(current_app.config['GOOGLE_DISCOVERY_URL']).json()
    except:
        return {}

@auth.route('/login')
def login():
    return render_template('login.html')

@auth.route('/login_google')
def login_google():
    token = request.args.get("token") # csrf
    session['token'] = token

    google_provider_cfg = get_google_provider_cfg()
    if not google_provider_cfg:
        raise GoogleConnectionError() # google provider config failed.

    request_uri = current_app.client.prepare_request_uri(
        google_provider_cfg["authorization_endpoint"],
        redirect_uri=f'{request.base_url}/callback',
        scope=["openid", "email", "profile"],
        state=token,
        # hd="cky.edu.hk", # enforce CKY-only accounts.
        prompt="select_account"
    )

    return redirect(request_uri)

@auth.route('/login_google/callback')
def login_google_callback():
    if request.args.get("state") != session["token"]: # request.args.get("token")
        raise InvalidState()
    code = request.args.get("code") # get auth code from google
    google_provider_cfg = get_google_provider_cfg()
    if not google_provider_cfg:
        raise GoogleConnectionError() # google provider config failed.

    token_url, headers, body = current_app.client.prepare_token_request(
        google_provider_cfg["token_endpoint"],
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(current_app.config['GOOGLE_CLIENT_ID'], current_app.config['GOOGLE_CLIENT_SECRET']),
    )

    current_app.client.parse_request_body_response(json.dumps(token_response.json()))

    uri, headers, body = current_app.client.add_token(google_provider_cfg["userinfo_endpoint"])
    userinfo_response = requests.get(uri, headers=headers, data=body).json()

    # add if email_verified
    googleId = userinfo_response["sub"]
    email = userinfo_response["email"]
    name = userinfo_response["name"]
    profilePic = userinfo_response["picture"].split('=s')[0]
    cky = "hd" in userinfo_response and userinfo_response["hd"] == 'cky.edu.hk'

    user = User.query.filter_by(googleId=googleId).first()
    if user is not None:
        login_user(user)
        return redirect(url_for('main.index'))
    else: # if user doesn't exist, sign up for user.
        user_new = User(googleId=googleId, email=email, name=name, profilePic=profilePic, cky=cky)
        print(user_new.profilePic)
        db.session.add(user_new)
        db.session.commit()
        login_user(user_new)
        flash('Signup successful!', 'success')
        return redirect(url_for('main.index'))

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))