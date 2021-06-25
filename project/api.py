from flask import Blueprint, redirect, url_for, request, session, current_app, abort, jsonify
from flask_login import login_required, current_user
from .models import User
from . import db
import subprocess # for regen

api = Blueprint('api', __name__)

@api.get('/api/regendb') # DANGEROUS, REMOVE.
def regendb():
    subprocess.call(args=['python3', 'resetdb.py'])
    return jsonify({
        'success': True
    })

@api.get('/api/v1/users/detail')
@login_required
def users():
    id = request.args.get("id") # for checking if id supplied
    data = {}

    user = User.query.filter_by(id=id).first() if id else current_user
    data['email'] = user.email
    data['name'] = user.name
    data['profilePic'] = user.profilePic
    data['profilePicLarge'] = f"{user.profilePic.split('=s')[0]}=s512-c"

    return jsonify(data)
