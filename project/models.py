from flask_login import UserMixin
from . import db

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) # pk
    stdid = db.Column(db.String(10), unique=True)
    name = db.Column(db.String(1000))
    password = db.Column(db.String(100))