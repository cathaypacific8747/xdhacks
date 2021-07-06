from discord import file
from flask import Blueprint, json, redirect, url_for, request, session, current_app, abort, jsonify
from flask_login import login_required, current_user
from flask_migrate import current
from sqlalchemy.sql.expression import desc, null
from .models import User, Book
from . import db
import subprocess # for regen
from .error_handler import GenericInputError, NoBookId
import re
from bleach import clean
import asyncio
from werkzeug.utils import secure_filename
import uuid
from io import BytesIO
import discord

api = Blueprint('api', __name__)

@api.get('/api/regendb') # DANGEROUS, REMOVE.
def regendb():
    subprocess.call(args=['python3', 'resetdb.py'])
    return jsonify({
        "status": "success",
        "message": None
    })

@api.get('/api/v1/user/detail')
@login_required
def user_detail():
    id = request.args.get("userId")
    user = User.query.filter_by(id=id).first() if id else current_user # get user information if specific user id not supplied

    return jsonify({
        "status": "success",
        "message": None,
        "data": user.getDetails()
    })

@api.post('/api/v1/user/update')
@login_required
def user_update():
    data = request.json
    
    if 'discord' in data and data['discord']:
        if not re.match(r'^((?!(discordtag|everyone|here)#)((?!@|#|:|```).{2,32})#\d{4})', data['discord']): raise GenericInputError(description="Discord username must be in its correct 'username#tag' format.")
        if len(data['instagram']) > 37: raise GenericInputError(description="Instagram username must be less or equal to than 37 characters.")
        data['discord'] = clean(data['discord'])

    if 'instagram' in data and data['instagram']:
        if not re.match(r'([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)', data['instagram']): raise GenericInputError(description="Instagram username must be in its correct format.")
        if len(data['instagram']) > 30: raise GenericInputError(description="Instagram username must be less than or equal to 30 characters.")
        data['instagram'] = clean(data['instagram'])

    if 'phone' in data and data['phone']:
        if not re.match(r'[^0,1,7]{1}[0-9]{7}', data['phone']): raise GenericInputError(description='Phone number must be a correct Hong Kong phone number.')
        if len(data['customContactInfo']) > 8: raise GenericInputError(description='Phone number must be a correct Hong Kong phone number.')

    if 'customContactInfo' in data and data['customContactInfo']:
        if len(data['customContactInfo']) > 200: raise GenericInputError(description='Custom contact information must be less than or equal to 200 characters.')
        data['customContactInfo'] = clean(data['customContactInfo'])

    current_user.updateDetails(data)
    db.session.commit()
    return jsonify({
        "status": "success",
        "message": "Settings were successfully updated.",
        "data": data
    })

@api.post('/api/v1/book/upload')
async def upload():
    print(request.form)

    async def store(file):
        return await current_app.discordThread.client.channel.send(file=file)

    urls = []
    for _, f in request.files.lists():
        extension = secure_filename(f[0].filename).split('.')[-1].lower() 
        if f[0].mimetype.split('/')[0] == 'image' and extension:
            with BytesIO() as mem:
                f[0].save(mem)
                mem.seek(0)
                future = asyncio.run_coroutine_threadsafe(store(file=discord.File(fp=mem, filename=f'{uuid.uuid4()}.{extension}')), current_app.discordThread.loop).result()
                urls.append(future.attachments[0].url)

    return jsonify({
        "status": "success",
        "message": None,
        "data": {
            "urls": urls
        }
    })

#

@api.get('/api/v1/book/detail')
@login_required
def book_detail():
    id = request.args.get("bookId")
    if not id:
        raise NoBookId()
    book = Book.query.filter_by(id=id).first()
    return jsonify({
        "status": "success",
        "message": None,
        "data": book.getDetails()
    })