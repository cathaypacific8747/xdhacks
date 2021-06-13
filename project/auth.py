from flask import Blueprint, render_template, redirect, url_for, request
from flask.helpers import flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required
from .models import User
from . import db
import re

auth = Blueprint('auth', __name__)
emailChk = re.compile(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")

@auth.route('/signup')
def signup():
    return render_template('signup.html')

@auth.route('/signup', methods=['POST'])
def signup_post():
    email = request.form.get('email') # unique
    name = request.form.get('name')
    password = request.form.get('password')
    err = False

    user = User.query.filter_by(email=email).first()
    if user: # user exists in database, redirect to signup to retry
        flash('User already exists!', 'danger')
        err = True

    if not emailChk.search(email):
        flash('Email format is invalid!', 'danger')
        err = True
    
    if err:
        return redirect(url_for('auth.signup'))

    # otherwise create new user with hashed pwd.
    new_user = User(email=email, name=name, password=generate_password_hash(password, method='sha256'), balance=0)
    db.session.add(new_user)
    db.session.commit()
    flash('Signup successful! You may now log in.', 'success')
    return redirect(url_for('auth.login')) # redirect to login page when signup is successful

@auth.route('/login')
def login():
    return render_template('login.html')

@auth.route('/login', methods=['POST'])
def login_post():
    email = request.form.get('email') # unique
    password = request.form.get('password')
    remember = bool(request.form.get('remember'))
    err = False

    if not emailChk.search(email):
        flash('Email is invalid! Format: []@cky.edu.hk', 'danger')
        err = True

    user = User.query.filter_by(email=email).first()

    if not user:
        flash('Email Address not found.', 'danger')
        err = True
    
    # print(generate_password_hash(password, method='sha256'), user.password)
    if not check_password_hash(user.password, password):
        flash('Password is incorrect.', 'danger') # if user not found or password hash does not match, try again
        err = True
    
    if err:
        return redirect(url_for('auth.login'))

    login_user(user, remember=remember)
    return redirect(url_for('main.profile')) # redirect to profile page when signup is successful

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))