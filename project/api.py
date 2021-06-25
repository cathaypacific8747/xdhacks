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

@api.get('/api/v1/user/detail')
@login_required
def users():
    id = request.args.get("id")
    user = User.query.filter_by(id=id).first() if id else current_user # get user information if specific user id not supplied
    
    data = {}
    for (k, v) in dict(vars(user)).items():
        print(k, v)
        if '_' not in k and k != "googleId":
            data[k] = v

    return jsonify({
        "status": "success",
        "data": data
    })
