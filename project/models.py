from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, VARCHAR, ARRAY
import uuid
from flask_login import UserMixin
from flask_mail import Message as Mail
from . import db, mail
from os import environ as env
import requests

def chain(root, *keys):
    result = root
    for k in keys:
        if isinstance(result, dict):
            result = result.get(k, None)
        else:
            result = getattr(result, k, None)
        if result is None:
            break
    return result

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    userid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    googleId = db.Column(VARCHAR(255), unique=True)
    name = db.Column(db.String(70), index=True)
    profilePic = db.Column(db.String(100))
    cky = db.Column(db.Boolean, default=False)
    emailnotifications = db.Column(db.Boolean, default=False)
    # payment_information
    cash = db.Column(db.Boolean, default=False)
    octopus = db.Column(db.Boolean, default=False)
    payme = db.Column(db.Boolean, default=False)
    tapngo = db.Column(db.Boolean, default=False)
    bankTransfer = db.Column(db.Boolean, default=False)
    wechatPay = db.Column(db.Boolean, default=False)
    alipay = db.Column(db.Boolean, default=False)
    eCheque = db.Column(db.Boolean, default=False)
    # sellerDetails
    negotiable = db.Column(db.Boolean, default=False)
    inSchoolExchange = db.Column(db.Boolean, default=False)
    meetup = db.Column(db.Boolean, default=False)
    delivery = db.Column(db.Boolean, default=False)
    # contactInfo
    public = db.Column(db.Boolean, default=False)
    email = db.Column(db.String(254), unique=True)
    discord = db.Column(db.String, default='')
    instagram = db.Column(db.String, default='')
    phone = db.Column(db.String, default='')
    whatsapp = db.Column(db.Boolean, default=False)
    signal = db.Column(db.Boolean, default=False)
    telegram = db.Column(db.Boolean, default=False)
    customContactInfo = db.Column(db.String, default='')

    def getInvalidKeys(self, read=True, public=True, myself=False):
        if myself:
            invalid = ["googleId"]
        elif read:
            invalid = ["googleId", "emailnotifications"] if public else ["googleId", "emailnotifications", "email", "discord", "instagram", "phone", "whatsapp", "signal", "telegram", "wechat", "customContactInfo"]
        else:
            invalid = ["userid", "googleId", "email", "name", "profilePic", "cky"]
        return invalid + [k for k in list(vars(self)) if '_' in k]
    
    def getDetails(self, overridepublic=False, myself=False):
        data = vars(self)
        invalidKeys = self.getInvalidKeys(read=True, public=self.public or overridepublic, myself=myself)

        for k in data.copy():
            if k in invalidKeys:
                del data[k]
        
        return data
    
    def updateDetails(self, data):
        invalidKeys = self.getInvalidKeys(read=False)

        for k in data:
            if k not in invalidKeys:
                setattr(self, k, data[k])

    def get_id(self):
        return str(self.userid) # should be unicode, but replace with str in Python 3

class Listing(db.Model):
    __tablename__ = 'listings'

    listingid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    ownerid = db.Column(UUID(as_uuid=True), db.ForeignKey('users.userid'), nullable=False, index=True)
    bookid = db.Column(db.String, default='', index=True)
    price = db.Column(db.SmallInteger, default=0)
    condition = db.Column(db.SmallInteger, default=0) # poor, acceptable, good, like new
    notes = db.Column(db.SmallInteger, default=0) # none, minimal, some
    remarks = db.Column(db.String, default='')
    images = db.Column(ARRAY(db.String), default=[])
    created = db.Column(db.DateTime(), default=datetime.utcnow)

    open = db.Column(db.Boolean, default=True)
    deleted = db.Column(db.Boolean, default=False)
    completed = db.Column(db.Boolean, default=False)

    def getDetails(self, public=True):
        data = {
            'listingid': self.listingid,
            'bookid': self.bookid,
            'price': self.price,
            'condition': self.condition,
            'notes': self.notes,
            'remarks': self.remarks,
            'images': self.images,
            'created': self.created.replace(tzinfo=timezone.utc).timestamp(),
        }
        if not public: # private, show visibility
            data['open'] = self.open
        return data

class Message(db.Model):
    __tablename__ = 'messages'

    messageid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    destinationuserid = db.Column(UUID(as_uuid=True), db.ForeignKey('users.userid'), nullable=True, index=True)
    originusername = db.Column(db.String, default='System Broadcast')
    messagetype = db.Column(db.String, default='system')
    item = db.Column(db.String, default='Unknown')
    system = db.Column(db.String, nullable=True, default=None)
    created = db.Column(db.DateTime(), default=datetime.utcnow)

    def getDetails(self):
        return {
            'messageid': self.messageid,
            'originusername': self.originusername,
            'messagetype': self.messagetype,
            'item': self.item,
            'system': self.system,
            'created': self.created.replace(tzinfo=timezone.utc).timestamp(),
        }
    
    def sendEmail(self, originuserid=''):
        if self.messagetype == 'offer_created':
            target = User.query.filter_by(userid=self.destinationuserid).first()
            if target and target.emailnotifications:
                hostname = env['HOSTNAME']
                new_mail = Mail(subject='New Offer', html=f'''Hi there,<br />
                <br />
                Your listing <b>{self.item}</b> has recieved an offer from <a href="https://{hostname}/profile/{originuserid}">{self.originusername}</a>.<br />
                For more details, please visit your <a href="https://{hostname}/dashboard">dashboard</a>.<br />
                <br />
                You can change your email notifications under your <a href="https://{hostname}/settings">account settings</a>.<br />
                If you have any questions, feel free to contact us at cheuna2@cky.edu.hk.<br />
                <br />
                ~ Swappy
                ''', recipients=[target.email])
                mail.send(new_mail)

class Offer(db.Model):
    __tablename__ = 'offers'

    offerid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    listingid = db.Column(UUID(as_uuid=True), db.ForeignKey('listings.listingid'), nullable=False, index=True)
    buyerid = db.Column(UUID(as_uuid=True), db.ForeignKey('users.userid'), nullable=False, index=True)
    sellerid = db.Column(UUID(as_uuid=True), db.ForeignKey('users.userid'), nullable=False, index=True)
    buyerpublic = db.Column(db.Boolean, default=False)
    sellerpublic = db.Column(db.Boolean, default=False)
    deleted = db.Column(db.Boolean, default=False)

    def getDetails(self):
        return {
            'offerid': self.offerid,
            'listingid': self.listingid,
            'buyerid': self.buyerid,
            'sellerid': self.sellerid,
            'buyerpublic': self.buyerpublic,
            'sellerpublic': self.sellerpublic,
        }

class Book(db.Model):
    __tablename__ = 'books'

    listingid = db.Column(db.String, primary_key=True, index=True)
    title = db.Column(db.String)
    isbn = db.Column(db.String)
    authors = db.Column(ARRAY(db.String))
    language = db.Column(db.String)
    # plurality = db.Column(db.String)
    publisher = db.Column(db.String)
    publishedDate = db.Column(db.String)
    pageCount = db.Column(db.Integer)
    # dimensions = db.Column(db.String)
    height = db.Column(db.String)
    width = db.Column(db.String)
    thickness = db.Column(db.String)
    thumbSmall = db.Column(db.String)

    def fromGoogle(self, bookid):
        try:
            data = requests.get(f'https://www.googleapis.com/books/v1/volumes/{bookid}').json()
        except Exception:
            data = {}
        
        self.title = chain(data, 'title')
        self.isbn = ''
        isbns = chain(data, 'volumeInfo', 'industryIdentifiers')
        if isbns is not None:
            for e in isbns:
                if chain(e, 'type') == 'ISBN_13':
                    self.isbn = chain(e, 'identifier')
                    break
        self.authors = chain(data, 'volumeInfo', 'authors')
        self.language = chain(data, 'volumeInfo', 'language')
        self.publisher = chain(data, 'volumeInfo', 'publisher')
        self.publishedDate = chain(data, 'volumeInfo', 'publishedDate')
        self.pageCount = chain(data, 'volumeInfo', 'pageCount')
        self.height = chain(data, 'volumeInfo', 'dimensions', 'height')
        self.width = chain(data, 'volumeInfo', 'dimensions', 'width')
        self.thickness = chain(data, 'volumeInfo', 'dimensions', 'thickness')
        self.thumbSmall = chain(data, 'volumeInfo', 'imageLinks', 'smallThumbnail')

        return self

    # this.googleId = data?.id;
    # this.title = data?.volumeInfo?.title;
    # this.isbn = data?.volumeInfo?.industryIdentifiers?.find(e => e.type == 'ISBN_13')?.identifier;
    # this.authors = data?.volumeInfo?.authors;
    # this.language = data?.volumeInfo?.language;
    # this.publisher = data?.volumeInfo?.publisher;
    # this.publishedDate = data?.volumeInfo?.publishedDate;
    # this.pageCount = data?.volumeInfo?.pageCount;
    # this.height = data?.volumeInfo?.dimensions?.height;
    # this.width = data?.volumeInfo?.dimensions?.width;
    # this.thickness = data?.volumeInfo?.dimensions?.thickness;
    # this.imagelinks = data?.volumeInfo?.imageLinks;
    # this.thumbSmall = this.imagelinks?.smallThumbnail?.replace('http', 'https');
    # this.thumbLarge = this.imagelinks?.extraLarge ? this.imagelinks.extraLarge : this.imagelinks?.large ? this.imagelinks.large : this.imagelinks?.medium ? this.imagelinks.medium : this.imagelinks?.small ? this.imagelinks.small : this.imagelinks?.thumbnail ? this.imagelinks.thumbnail : this.imagelinks?.smallThumbnail;
    # this.thumbLarge = this.thumbLarge?.replace('http', 'https');

    # this.strings = {};
    # this.strings.title = this.title || 'Unknown';
    # this.strings.isbn = this.isbn || 'Unknown';
    # this.strings.authors = this.authors ? this.authors.join(this.language && this.language.includes('en') ? ', ' : '、') : 'Unknown';
    # this.strings.plurality = this.authors ? this.authors.length > 1 ? 's' : '' : '';
    # this.strings.publisher = this.publisher || 'Unknown';
    # this.strings.publishedDate = this.publishedDate || 'Unknown';
    # this.strings.pageCount = this.pageCount || 'Unknown';
    # this.strings.dimensions = (this.height && this.width && this.thickness) ? `Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}` : 'Unknown';
    # this.strings.thumbSmall = this.thumbSmall ? this.thumbSmall : this.thumbLarge ? this.thumbLarge : 'https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif';
