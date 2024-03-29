from flask import Blueprint, request, current_app, jsonify
from flask_login import current_user
from .models import User, Listing, Message, Offer
from . import db, csrf
from .error_handler import APIForbiddenError, GenericInputError
import re
from bleach import clean as clean_raw
import asyncio
from werkzeug.utils import secure_filename
import uuid
from io import BytesIO
import discord
from sqlalchemy import func
import requests

api = Blueprint('api', __name__)
def clean(string):
    return clean_raw(string, tags=[], attributes=[], styles=[], protocols=[])

def intable(string):
    try:
        int(string)
        return True
    except ValueError:
        return False
def getBookname(bookid):
    try:
        name = requests.get(f'https://www.googleapis.com/books/v1/volumes/{bookid}?projection=lite').json()['volumeInfo']['title']
        return f'{name}'
    except Exception:
        return 'Unknown'

@api.before_request
def check_csrf():
    csrf.protect()

@api.get('/api/v1/user/detail')
def user_detail():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    userid = request.args.get("userid")
    user = User.query.filter_by(userid=userid).first() if userid else current_user # get user information if specific user id not supplied

    if not user:
        raise GenericInputError(description='No such user found.')

    return jsonify({
        "status": "success",
        "message": None,
        "data": user.getDetails(overridepublic=not bool(userid), myself=not bool(userid))
    })

@api.patch('/api/v1/user/update')
def user_update():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    data = request.json
    if not data:
        raise GenericInputError()

    if 'discord' in data and data['discord']:
        if not re.match(r'^((?!(discordtag|everyone|here)#)((?!@|#|:|```).{2,32})#\d{4})', data['discord']):
            raise GenericInputError(description="Discord username must be in its correct 'username#tag' format.")
        if len(data['instagram']) > 37:
            raise GenericInputError(description="Instagram username must be less or equal to than 37 characters.")
        data['discord'] = clean(data['discord'])

    if 'instagram' in data and data['instagram']:
        if not re.match(r'([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)', data['instagram']):
            raise GenericInputError(description="Instagram username must be in its correct format.")
        if len(data['instagram']) > 30:
            raise GenericInputError(description="Instagram username must be less than or equal to 30 characters.")
        data['instagram'] = clean(data['instagram'])

    if 'phone' in data and data['phone']:
        if not re.match(r'[^0,1,7]{1}[0-9]{7}', data['phone']):
            raise GenericInputError(description='Phone number must be a correct Hong Kong phone number.')

    if 'customContactInfo' in data and data['customContactInfo']:
        if len(data['customContactInfo']) > 200:
            raise GenericInputError(description='Custom contact information must be less than or equal to 200 characters.')
        data['customContactInfo'] = clean(data['customContactInfo'])
    
    current_user.updateDetails(data)
    db.session.commit()
    return jsonify({
        "status": "success",
        "message": "Settings were successfully updated.",
        "data": data
    })

@api.post('/api/v1/listing/upload')
async def upload():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    async def store(file):
        return await current_app.discordThread.client.channel.send(file=file)

    ownerid = current_user.userid
    bookid = request.form.get('bookid')
    price = request.form.get('price')
    condition = request.form.get('condition')
    notes = request.form.get('notes')
    remarks = request.form.get('remarks')

    if not bookid:
        raise GenericInputError()
    if not intable(price) or int(price) < 0 and int(price) >= 10000:
        raise GenericInputError(description="price must be an integer between 0 and 9999, inclusive.")
    if not intable(condition) or int(condition) not in [0, 1, 2, 3]:
        raise GenericInputError()
    if not intable(notes) or int(notes) not in [0, 1, 2]:
        raise GenericInputError()
    bookid = clean(bookid)
    remarks = clean(remarks)

    images = []
    for _, f in request.files.lists():
        extension = secure_filename(f[0].filename).split('.')[-1].lower() 
        if f[0].mimetype.split('/')[0] == 'image' and extension:
            with BytesIO() as mem:
                f[0].save(mem)
                mem.seek(0)
                size = mem.getbuffer().nbytes
                if size <= 0 or size >= 8e6:
                    raise GenericInputError(description='File size is too large.')
                future = asyncio.run_coroutine_threadsafe(store(file=discord.File(fp=mem, filename=f'{uuid.uuid4()}.{extension}')), current_app.discordThread.loop).result()
                images.append(future.attachments[0].url)
    
    listing = Listing(ownerid=ownerid, bookid=bookid, price=price, condition=condition, notes=notes, remarks=remarks, images=images)
    db.session.add(listing)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": None
    })

    # window.Book = class {
    #     constructor(data) {
    #         this.googleId = data?.id;
    #         this.title = data?.volumeInfo?.title;
    #         this.isbn = data?.volumeInfo?.industryIdentifiers?.find(e => e.type == 'ISBN_13')?.identifier;
    #         this.authors = data?.volumeInfo?.authors;
    #         this.language = data?.volumeInfo?.language;
    #         this.publisher = data?.volumeInfo?.publisher;
    #         this.publishedDate = data?.volumeInfo?.publishedDate;
    #         this.pageCount = data?.volumeInfo?.pageCount;
    #         this.height = data?.volumeInfo?.dimensions?.height;
    #         this.width = data?.volumeInfo?.dimensions?.width;
    #         this.thickness = data?.volumeInfo?.dimensions?.thickness;
    #         this.imagelinks = data?.volumeInfo?.imageLinks;
    #         this.thumbSmall = this.imagelinks?.smallThumbnail?.replace('http', 'https');
    #         this.thumbLarge = this.imagelinks?.extraLarge ? this.imagelinks.extraLarge : this.imagelinks?.large ? this.imagelinks.large : this.imagelinks?.medium ? this.imagelinks.medium : this.imagelinks?.small ? this.imagelinks.small : this.imagelinks?.thumbnail ? this.imagelinks.thumbnail : this.imagelinks?.smallThumbnail;
    #         this.thumbLarge = this.thumbLarge?.replace('http', 'https');

    #         this.strings = {};
    #         this.strings.title = this.title || 'Unknown';
    #         this.strings.isbn = this.isbn || 'Unknown';
    #         this.strings.authors = this.authors ? this.authors.join(this.language && this.language.includes('en') ? ', ' : '、') : 'Unknown';
    #         this.strings.plurality = this.authors ? this.authors.length > 1 ? 's' : '' : '';
    #         this.strings.publisher = this.publisher || 'Unknown';
    #         this.strings.publishedDate = this.publishedDate || 'Unknown';
    #         this.strings.pageCount = this.pageCount || 'Unknown';
    #         this.strings.dimensions = (this.height && this.width && this.thickness) ? `Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}` : 'Unknown';
    #         this.strings.thumbSmall = this.thumbSmall ? this.thumbSmall : this.thumbLarge ? this.thumbLarge : 'https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif';
    #     }
    # };

@api.post('/api/v2/listing/upload')
async def upload_v2():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    async def store(file):
        return await current_app.discordThread.client.channel.send(file=file)

    ownerid = current_user.userid
    bookid = request.form.get('bookid')
    price = request.form.get('price')
    condition = request.form.get('condition')
    notes = request.form.get('notes')
    remarks = request.form.get('remarks')

    if not bookid:
        raise GenericInputError()
    if not intable(price) or int(price) < 0 and int(price) >= 10000:
        raise GenericInputError(description="price must be an integer between 0 and 9999, inclusive.")
    if not intable(condition) or int(condition) not in [0, 1, 2, 3]:
        raise GenericInputError()
    if not intable(notes) or int(notes) not in [0, 1, 2]:
        raise GenericInputError()
    bookid = clean(bookid)
    remarks = clean(remarks)

    images = []
    for _, f in request.files.lists():
        extension = secure_filename(f[0].filename).split('.')[-1].lower() 
        if f[0].mimetype.split('/')[0] == 'image' and extension:
            with BytesIO() as mem:
                f[0].save(mem)
                mem.seek(0)
                size = mem.getbuffer().nbytes
                if size <= 0 or size >= 8e6:
                    raise GenericInputError(description='File size is too large.')
                future = asyncio.run_coroutine_threadsafe(store(file=discord.File(fp=mem, filename=f'{uuid.uuid4()}.{extension}')), current_app.discordThread.loop).result()
                images.append(future.attachments[0].url)
    
    listing = Listing(ownerid=ownerid, bookid=bookid, price=price, condition=condition, notes=notes, remarks=remarks, images=images)
    db.session.add(listing)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": None
    })

@api.get('/api/v1/listing/detail')
def listing_detail():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    userid = request.args.get("userid")
    if userid: # querying others
        listings = Listing.query.filter_by(ownerid=userid, deleted=False, open=True, completed=False).order_by(Listing.created.desc()).all()
        data = [l.getDetails(public=True) for l in listings]
    else:
        listings = Listing.query.filter_by(ownerid=current_user.userid, deleted=False, completed=False).order_by(Listing.created.desc()).all()
        data = [l.getDetails(public=False) for l in listings]

    return jsonify({
        "status": "success",
        "message": None,
        "data": data
    })

@api.put('/api/v1/listing/toggleOpen')
def listing_toggleOpen():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    listingid = request.args.get("listingId")
    if not listingid:
        raise GenericInputError()
    
    listing = Listing.query.filter_by(listingid=listingid, deleted=False, completed=False).first()
    if listing.ownerid != current_user.userid:
        raise APIForbiddenError()
    
    listing.open = not listing.open

    # notify buyers of this change.
    bookname = getBookname(listing.bookid)
    offers = Offer.query.filter_by(listingid=listing.listingid, deleted=False).all()
    for offer in offers:
        if not listing.open:
            message_new = Message(destinationuserid=offer.buyerid, originusername=current_user.name, messagetype='listing_disabled', item=bookname)
        else:
            message_new = Message(destinationuserid=offer.buyerid, originusername=current_user.name, messagetype='listing_enabled', item=bookname)
        db.session.add(message_new)
    
    db.session.commit()
    return jsonify({
        "status": "success",
        "message": None,
        "data": {
            "open": listing.open
        }
    })

@api.delete('/api/v1/listing/delete')
def listing_delete():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    listingid = request.args.get("listingid")
    if not listingid:
        raise GenericInputError()
    
    listing = Listing.query.filter_by(listingid=listingid, deleted=False, completed=False).first()
    if listing.ownerid != current_user.userid:
        raise APIForbiddenError()

    # delete buyer's offer and notify them.
    bookname = getBookname(listing.bookid)
    offers = Offer.query.filter_by(listingid=listing.listingid, deleted=False).all()
    for offer in offers:
        offer.deleted = True
        message_new = Message(destinationuserid=offer.buyerid, originusername=current_user.name, messagetype='listing_deleted', item=bookname)
        db.session.add(message_new)
    
    listing.deleted = True

    db.session.commit()
    return jsonify({
        "status": "success",
        "message": None,
        "data": None
    })

@api.post('/api/v1/market/aggregate')
def aggregate():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    data = request.json
    if not data or "bookids" not in data:
        raise GenericInputError()
    
    query = Listing.query.filter_by(open=True, deleted=False, completed=False)
    if data["bookids"]:
        query = query.filter(Listing.bookid.in_(data["bookids"]))
    books = query.with_entities(Listing.bookid, func.count(Listing.bookid), func.min(Listing.price)).group_by(Listing.bookid).limit(40).all()
    
    return jsonify({
        "status": "success",
        "message": None,
        "data": [{
            'bookid': book[0],
            'count': book[1],
            'minPrice': book[2] 
        } for book in books]
    })

@api.get('/api/v1/market/detail')
def market_detail():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    bookid = request.args.get("bookid")
    if not bookid:
        raise GenericInputError()
    
    listings = db.session.query(Listing, User)\
        .filter(Listing.bookid == bookid)\
        .filter(Listing.open == True)\
        .filter(Listing.deleted == False, Listing.completed == False)\
        .join(User, Listing.ownerid == User.userid)\
        .all()
    
    data = []
    for listing, owner in listings:
        lfull = listing.getDetails()
        lfull["owner"] = owner.getDetails()
        lfull["invalid"] = ''
        if owner.userid == current_user.userid:
            lfull["invalid"] = 'You cannot create an offer on your own listing.'
        if Offer.query.filter_by(listingid=listing.listingid, buyerid=current_user.userid, deleted=False).first() is not None:
            lfull["invalid"] = 'You already have a pending offer on this listing.'
        data.append(lfull)

    return jsonify({
        "status": "success",
        "message": None,
        "data": data
    })

@api.get('/api/v1/dashboard/messages')
def messages():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    messages = Message.query.filter_by(destinationuserid=current_user.userid).order_by(Message.created.desc()).limit(20).all()

    return jsonify({
        "status": "success",
        "message": None,
        "data": [m.getDetails() for m in messages]
    })

@api.post('/api/v1/offer/create')
def create():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    data = request.json
    if not data or "listingid" not in data:
        raise GenericInputError()

    buyerid = current_user.userid
    listing = Listing.query.filter_by(listingid=data["listingid"], open=True, deleted=False, completed=False).first()
    if not listing:
        raise GenericInputError('Unfortunately, this listing is no longer avaliable. It may have been deleted by the seller, or sold out.')
    listingid = listing.listingid
    sellerid = listing.ownerid

    if buyerid == sellerid:
        raise GenericInputError('You cannot create an offer on your own listing.')

    if Offer.query.filter_by(listingid=listingid, buyerid=buyerid, deleted=False).first() is not None:
        raise GenericInputError('You already have a pending offer on this listing.')

    offer_new = Offer(listingid=listingid, buyerid=buyerid, sellerid=sellerid)
    db.session.add(offer_new)

    message_new = Message(destinationuserid=sellerid, originusername=current_user.name, messagetype='offer_created', item=getBookname(listing.bookid))
    message_new.sendEmail(originuserid=current_user.userid)
    db.session.add(message_new)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": None,
        "data": None
    })

@api.get('/api/v1/offer/detail')
def offer_detail():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    sellerOffers = db.session.query(Offer, User, Listing)\
        .filter(Offer.sellerid == current_user.userid, Offer.deleted == False)\
        .join(User, Offer.buyerid == User.userid)\
        .join(Listing, Offer.listingid == Listing.listingid)\
        .filter(Listing.deleted == False, Listing.completed == False)\
        .all()
    
    buyerOffers = db.session.query(Offer, User, Listing)\
        .filter(Offer.buyerid == current_user.userid, Offer.deleted == False)\
        .join(User, Offer.sellerid == User.userid)\
        .join(Listing, Offer.listingid == Listing.listingid)\
        .filter(Listing.deleted == False, Listing.completed == False)\
        .all()
    
    sOffers = []
    bOffers = []
    for raw, processed, oppositerole in [[sellerOffers, sOffers, 'buyer'], [buyerOffers, bOffers, 'seller']]:
        for offer, user, listing in raw:
            ld = listing.getDetails()
            ud = user.getDetails(overridepublic=getattr(offer, f'{oppositerole}public'))
            od = offer.getDetails()

            if not any(s['listing'] == ld for s in processed):
                processed.append({
                    "listing": ld,
                    "offers": []
                })
            for s in processed:
                if s["listing"] == ld:
                    s["offers"].append({
                        "user": ud,
                        "offer": od
                    })
                    break

    return jsonify({
        "status": "success",
        "message": None,
        "data": {
            "seller": sOffers,
            "buyer": bOffers,
            "public": current_user.public
        }
    })

@api.put('/api/v1/offer/togglePublicity')
def offer_togglePublicity():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    offerid = request.args.get("offerid")
    if not offerid:
        raise GenericInputError()

    offer = Offer.query.filter_by(offerid=offerid, deleted=False).first()
    listing = Listing.query.filter_by(listingid=offer.listingid, deleted=False, completed=False).first()
    if not offer or not listing:
        raise GenericInputError('Unfortunately, this offer is no longer avaliable. It may have been deleted or sold out.')
    elif offer.sellerid == current_user.userid:
        offer.sellerpublic = not offer.sellerpublic
        public = offer.sellerpublic
        if public:
            message_new = Message(destinationuserid=offer.buyerid, originusername=current_user.name, messagetype='offer_contact_granted', item=getBookname(listing.bookid))
        else:
            message_new = Message(destinationuserid=offer.sellerid, originusername=current_user.name, messagetype='offer_contact_request', item=getBookname(listing.bookid))
    elif offer.buyerid == current_user.userid:
        offer.buyerpublic = not offer.buyerpublic
        public = offer.buyerpublic
        if public:
            message_new = Message(destinationuserid=offer.sellerid, originusername=current_user.name, messagetype='offer_contact_granted', item=getBookname(listing.bookid))
        else:
            message_new = Message(destinationuserid=offer.buyerid, originusername=current_user.name, messagetype='offer_contact_request', item=getBookname(listing.bookid))
    else:
        raise APIForbiddenError()

    db.session.add(message_new)
    db.session.commit()
    return jsonify({
        "status": "success",
        "message": None,
        "data": {
            "public": public
        }
    })

@api.delete('/api/v1/offer/cancel')
def offer_cancel():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    offerid = request.args.get("offerid")
    if not offerid:
        raise GenericInputError()
    
    offer = Offer.query.filter_by(offerid=offerid, deleted=False).first()
    listing = Listing.query.filter_by(listingid=offer.listingid, deleted=False, completed=False).first()
    if not offer or not listing:
        raise GenericInputError('Unfortunately, this offer is no longer avaliable. It may have been deleted or sold out.')
    elif current_user.userid == offer.sellerid:
        message_new = Message(destinationuserid=offer.buyerid, originusername=current_user.name, messagetype='offer_cancelled', item=getBookname(listing.bookid))
    elif current_user.userid == offer.buyerid:
        message_new = Message(destinationuserid=offer.sellerid, originusername=current_user.name, messagetype='offer_cancelled', item=getBookname(listing.bookid))
    else:
        raise APIForbiddenError()
    
    offer.deleted = True
    db.session.add(message_new)
    db.session.commit()
    return jsonify({
        "status": "success",
        "message": None,
        "data": None
    })

@api.delete('/api/v1/offer/complete')
def offer_complete():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    offerid = request.args.get("offerid")
    if not offerid:
        raise GenericInputError()
    
    offer = Offer.query.filter_by(offerid=offerid, deleted=False).first()
    listing = Listing.query.filter_by(listingid=offer.listingid, deleted=False, completed=False).first()
    if not offer or not listing:
        raise GenericInputError('Unfortunately, this offer is no longer avaliable. It may have been deleted or sold out.')
    elif current_user.userid == offer.sellerid:
        listing.completed = True

        offers = Offer.query.filter_by(listingid=offer.listingid, deleted=False).all()
        for o in offers:
            if o != offer:
                o.deleted = True
                l = Listing.query.filter_by(listingid=o.listingid, deleted=False, completed=False).first()
                message_new = Message(destinationuserid=o.buyerid, originusername=current_user.name, messagetype='listing_completed', item=getBookname(l.bookid))
                db.session.add(message_new)
    else:
        raise APIForbiddenError()
    
    db.session.commit()
    return jsonify({
        "status": "success",
        "message": None,
        "data": None
    })