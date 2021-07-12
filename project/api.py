from typing import Generic
from flask import Blueprint, json, redirect, url_for, request, session, current_app, abort, jsonify
from flask_login import current_user
from flask_migrate import current
from .models import User, Listing, Room
from . import db, socketio
from flask_socketio import join_room, leave_room
from .error_handler import APIForbiddenError, GenericInputError
import re
from bleach import clean
import asyncio
from werkzeug.utils import secure_filename
import uuid
from io import BytesIO
import discord
from sqlalchemy import func

api = Blueprint('api', __name__)

def intable(string):
    try:
        int(string)
        return True
    except ValueError:
        return False

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
        "data": user.getDetails()
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
        if len(data['customContactInfo']) > 8:
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
    if not intable(price) or int(price) < 0 and int(price) >= 1000:
        raise GenericInputError(description="Price must be a positive integer.")
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
                print(size)
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
    
    listing = Listing.query.filter_by(listingid=listingid).first()
    if listing.ownerid != current_user.userid:
        raise APIForbiddenError()
    
    listing.open = not listing.open
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
    
    listing = Listing.query.filter_by(listingid=listingid).first()
    if listing.ownerid != current_user.userid:
        raise APIForbiddenError()
    
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
    
    query = Listing.query.filter_by(open=True, deleted=False)
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
        .join(User, Listing.ownerid == User.userid)\
        .filter(Listing.bookid == bookid)\
        .filter(Listing.open == True)\
        .filter(Listing.deleted == False)\
        .all()
    
    data = []
    for l in listings:
        lfull = l[0].getDetails()
        lfull["owner"] = l[1].getDetails()
        data.append(lfull)

    return jsonify({
        "status": "success",
        "message": None,
        "data": data
    })

@api.post('/api/v1/message/create')
def create():
    if not current_user.is_authenticated:
        raise APIForbiddenError()

    data = request.json
    if not data or "listingid" not in data:
        raise GenericInputError()

    buyerid = current_user.userid
    listing = Listing.query.filter_by(listingid=data["listingid"], open=True, deleted=False, completed=False).first()
    if not listing:
        raise GenericInputError() # listing has been deleted or completed
    listingid = listing.listingid
    sellerid = listing.ownerid

    room_new = Room(buyerid=buyerid, sellerid=sellerid, listingid=listingid)
    db.session.add(room_new)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": None,
        "data": {
            "roomid": room_new.roomid
        }
    })

# @socketio.on('join')
# def on_join(data):
#     username = session['username']
#     room = data['room']
#     join_room(room)

# @socketio.on('json')
# def handle_json(data):
#     print(f'MESSAGE RECIEVED: {data}')