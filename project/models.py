from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    studentid = db.Column(db.String(10), unique=True)
    name = db.Column(db.String(1000))
    password = db.Column(db.String(100))