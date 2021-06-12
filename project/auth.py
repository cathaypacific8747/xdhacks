from flask import Blueprint, render_template, redirect, url_for, request
from flask.helpers import flash
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db

auth = Blueprint('auth', __name__)

@auth.route('/signup')
def signup():
    return render_template('signup.html')

@auth.route('/signup', methods=['POST'])
def signup_post():
    stdid = request.form.get('stdid') # unique
    name = request.form.get('name')
    password = request.form.get('password')

    user = User.query.filter_by(stdid=stdid).first()

    if user: # user exists in database, redirect to signup to retry
        flash('User already exists!')
        return redirect(url_for('auth.signup'))

    # otherwise create new user with hashed pwd.
    new_user = User(stdid=stdid, name=name, password=generate_password_hash(password, method='sha256'))
    db.session.add(new_user)
    db.session.commit()
    return redirect(url_for('auth.login')) # redirect to login page when signup is successful

@auth.route('/login')
def login():
    return render_template('login.html')

@auth.route('/logout')
def logout():
    return 'Logout'