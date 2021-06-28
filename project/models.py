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
    wechatPay = db.Column(db.Boolean, default=False)
    alipay = db.Column(db.Boolean, default=False)
    eCheque = db.Column(db.Boolean, default=False)
    #
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
    customContactInfo = db.Column(db.String(200), default='')

    def getValidKeys(self, mode, public=True):
        # returns a list of keys that are readable/writable.
        if mode == 'r':
            if public:
                exempted_keys = ("googleId")
            else:
                exempted_keys = ("googleId", "discord", "instagram", "phone", "whatsapp", "signal", "telegram", "wechat", "customContactInfo")
        else:
            exempted_keys = ("id", "googleId", "email", "name", "profilePic", "cky")
        return [k for k in list(vars(self)) if k not in exempted_keys and "_" not in k]

    def getDetails(self):
        data = vars(self)
        validKeys = self.getValidKeys(mode='r', public=self.public)

        for k in data.copy(): # to avoid runtimeError
            if k not in validKeys:
                del data[k]

        return data

    def updateDetails(self, data):
        validKeys = self.getValidKeys(mode='w')
        for k in data:
            if k in validKeys:
                setattr(self, k, data[k])

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