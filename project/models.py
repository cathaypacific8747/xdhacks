from enum import unique
from flask_login import UserMixin
from . import db

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True) # pk, ai
    googleId = db.Column(db.BigInteger, unique=True, index=True)
    email = db.Column(db.String(50), unique=True, index=True)
    name = db.Column(db.String(100), index=True)
    profilePic = db.Column(db.String(100))
    # password = db.Column(db.String(100))
    # balance = db.Column(db.Integer)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(1000))
    isbn = db.Column(db.BigInteger)
    imagepath = db.Column(db.String(100))

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bookId = db.Column(db.Integer)
    ownerId = db.Column(db.Integer)
    price = db.Column(db.Integer)
    condition = db.Column(db.Integer)