from enum import unique
from flask_login import UserMixin
from . import db

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True) # pk, ai
    googleId = db.Column(db.BigInteger, unique=True, index=True)
    email = db.Column(db.String(254), unique=True, index=True)
    name = db.Column(db.String(70), index=True)
    profilePic = db.Column(db.String(100))
    cky = db.Column(db.Boolean, default=False)
    # acceptedPaymentMethods
    cash = db.Column(db.Boolean, default=False)
    octopus = db.Column(db.Boolean, default=False)
    payme = db.Column(db.Boolean, default=False)
    tapngo = db.Column(db.Boolean, default=False)
    bankTransfer = db.Column(db.Boolean, default=False)
    eCheque = db.Column(db.Boolean, default=False)

    buyer = db.Column(db.Boolean, default=False)
    seller = db.Column(db.Boolean, default=False)
    # sellerDetails
    negotiable = db.Column(db.Boolean, default=False)
    schoolMeetup = db.Column(db.Boolean, default=False)
    meetup = db.Column(db.Boolean, default=False)
    delivery = db.Column(db.Boolean, default=False)
    # contactInfo
    public = db.Column(db.Boolean, default=True)
    discord = db.Column(db.String, default='')
    instagram = db.Column(db.String(30), default='')
    phone = db.Column(db.Integer, default='')
    whatsapp = db.Column(db.Boolean, default=False)
    signal = db.Column(db.Boolean, default=False)
    telegram = db.Column(db.Boolean, default=False)
    wechat = db.Column(db.Boolean, default=False)
    customContactInfo = db.Column(db.String(200), default='')

    def getDetails(self):
        data = {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "profilePic": self.profilePic,
            "cky": self.cky,
            "acceptedPaymentMethods":{
                "cash": self.cash,
                "octopus": self.octopus,
                "payme": self.payme,
                "tapngo": self.tapngo,
                "bankTransfer": self.bankTransfer,
                "eCheque": self.eCheque,
            }
        }
        data["buyer"] = self.buyer
        data["seller"] = self.seller
        if self.seller:
            data["sellerDetails"] = {
                "negotiable": self.negotiable,
                "schoolMeetup": self.schoolMeetup,
                "meetup": self.meetup,
                "delivery": self.delivery,
            }
        
        data["public"] = self.public
        if self.public:
            data["contactInfo"] = {
                "discord": self.discord,
                "instagram": self.instagram,
                "phone": self.phone,
                "whatsapp": self.whatsapp,
                "signal": self.signal,
                "telegram": self.telegram,
                "wechat": self.wechat,
                "customContactInfo": self.customContactInfo,
            }

        return data

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