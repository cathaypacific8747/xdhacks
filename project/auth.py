from flask import Blueprint, render_template, redirect, url_for, request
from flask.helpers import flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required
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
        print(User.__dict__)
        flash('User already exists!', 'danger')
        return redirect(url_for('auth.signup'))

    # otherwise create new user with hashed pwd.
    new_user = User(stdid=stdid, name=name, password=generate_password_hash(password, method='sha256'))
    db.session.add(new_user)
    db.session.commit()
    flash('Signup successful! You may now log in.', 'success')
    return redirect(url_for('auth.login')) # redirect to login page when signup is successful

@auth.route('/login')
def login():
    return render_template('login.html')

@auth.route('/login', methods=['POST'])
def login_post():
    stdid = request.form.get('stdid')
    password = request.form.get('password')
    remember = bool(request.form.get('remember'))

    user = User.query.filter_by(stdid=stdid).first()

    if not user or not check_password_hash(user.password, password):
        flash('Please check your login details and try again!', 'danger')
        return redirect(url_for('auth.login')) # if user not found or password hash does not match, try again

    login_user(user, remember=remember)
    return redirect(url_for('main.profile')) # redirect to profile page when signup is successful

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))