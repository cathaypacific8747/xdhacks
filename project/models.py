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
    cky = db.Column(db.Boolean, default=False)
    seller = db.Column(db.Boolean, default=False)
    buyer = db.Column(db.Boolean, default=False)
    # seller settings
    negotiable = db.Column(db.Boolean, default=False)
    schoolMeetup = db.Column(db.Boolean, default=False)
    meetup = db.Column(db.Boolean, default=False)
    delivery = db.Column(db.Boolean, default=False)
    # payment methods
    cash = db.Column(db.Boolean, default=False)
    octopus = db.Column(db.Boolean, default=False)
    payme = db.Column(db.Boolean, default=False)
    tapngo = db.Column(db.Boolean, default=False)
    bankTransfer = db.Column(db.Boolean, default=False)
    eCheque = db.Column(db.Boolean, default=False)

class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(1000))
    isbn = db.Column(db.BigInteger)
    imagepath = db.Column(db.String(100))

class Inventory(db.Model):
    __tablename__ = 'inventory'

    id = db.Column(db.Integer, primary_key=True)
    bookId = db.Column(db.Integer)
    ownerId = db.Column(db.Integer)
    price = db.Column(db.Integer)
    condition = db.Column(db.Integer)