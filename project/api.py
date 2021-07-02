from flask import Blueprint, json, redirect, url_for, request, session, current_app, abort, jsonify
from flask_login import login_required, current_user
from .models import User, Book
from . import db
import subprocess # for regen
from .error_handler import NoBookId

api = Blueprint('api', __name__)

@api.get('/api/regendb') # DANGEROUS, REMOVE.
def regendb():
    subprocess.call(args=['python3', 'resetdb.py'])
    return jsonify({
        'success': True
    })

@api.get('/api/v1/user/detail')
@login_required
def user_detail():
    id = request.args.get("userId")
    user = User.query.filter_by(id=id).first() if id else current_user # get user information if specific user id not supplied

    return jsonify({
        "status": "success",
        "data": user.getDetails()
    })

@api.post('/api/v1/user/update')
@login_required
def user_update():
    current_user.updateDetails(request.json)
    db.session.commit()
    return jsonify({
        "status": "success"
    })

@api.get('/api/v1/book/detail')
@login_required
def book_detail():
    id = request.args.get("bookId")
    if not id:
        raise NoBookId()
    book = Book.query.filter_by(id=id).first()
    return jsonify({
        "status": "success",
        "data": book.getDetails()
    })