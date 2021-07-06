from sqlalchemy.dialects.postgresql import UUID, VARCHAR, ARRAY
import uuid
from flask_login import UserMixin
from . import db

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    googleId = db.Column(VARCHAR(255), unique=True)
    email = db.Column(db.String(254), unique=True)
    name = db.Column(db.String(70), index=True)
    profilePic = db.Column(db.String(100))
    cky = db.Column(db.Boolean, default=False)
    # payment_information
    cash = db.Column(db.Boolean, default=False)
    octopus = db.Column(db.Boolean, default=False)
    payme = db.Column(db.Boolean, default=False)
    tapngo = db.Column(db.Boolean, default=False)
    bankTransfer = db.Column(db.Boolean, default=False)
    wechatPay = db.Column(db.Boolean, default=False)
    alipay = db.Column(db.Boolean, default=False)
    eCheque = db.Column(db.Boolean, default=False)
    # account_type
    buyer = db.Column(db.Boolean, default=False)
    seller = db.Column(db.Boolean, default=False)
    # sellerDetails
    negotiable = db.Column(db.Boolean, default=False)
    inSchoolExchange = db.Column(db.Boolean, default=False)
    meetup = db.Column(db.Boolean, default=False)
    delivery = db.Column(db.Boolean, default=False)
    # contactInfo
    public = db.Column(db.Boolean, default=True)
    discord = db.Column(db.String, default='')
    instagram = db.Column(db.String, default='')
    phone = db.Column(db.String, default='')
    whatsapp = db.Column(db.Boolean, default=False)
    signal = db.Column(db.Boolean, default=False)
    telegram = db.Column(db.Boolean, default=False)
    customContactInfo = db.Column(db.String, default='')

    def getInvalidKeys(self, read=True, public=True):
        if read:
            invalid = ["googleId"] if public else ["googleId", "discord", "instagram", "phone", "whatsapp", "signal", "telegram", "wechat", "customContactInfo"]
        else:
            invalid = ["id", "googleId", "email", "name", "profilePic", "cky"]
        return invalid + [k for k in list(vars(self)) if '_' in k]
    
    def getDetails(self):
        data = vars(self)
        invalidKeys = self.getInvalidKeys(read=True, public=self.public)

        for k in data.copy():
            if k in invalidKeys:
                del data[k]
        
        return data
    
    def updateDetails(self, data):
        invalidKeys = self.getInvalidKeys(read=False)

        for k in data:
            if k not in invalidKeys:
                setattr(self, k, data[k])

class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    isbn = db.Column(db.String, unique=True, nullable=False, index=True, default='')
    name = db.Column(db.String, default='', index=True)
    publisher = db.Column(db.String, default='')
    image = db.Column(db.String, default='')
    google_id = db.Column(db.String, default='')

class Listings(db.Model):
    __tablename__ = 'listings'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    ownerid = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    bookid = db.Column(UUID(as_uuid=True), db.ForeignKey('books.id'), nullable=False)
    price = db.Column(db.SmallInteger, default=0)
    images = db.Column(ARRAY(db.String), default=[])
    quality = db.Column(db.SmallInteger, default=0)
    notes = db.Column(db.Boolean, default=False)
    customInfo = db.Column(db.String, default='')

    created = db.Column(db.DateTime())
    open = db.Column(db.Boolean, default=True)
    sold = db.Column(db.Boolean, default=False)