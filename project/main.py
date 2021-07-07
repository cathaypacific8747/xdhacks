from project.auth import login
from flask import Blueprint, render_template, redirect, url_for, request, current_app
from flask_login import login_required, current_user
from flask.helpers import flash
from . import db
from .models import User, Listings

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/settings')
@login_required
def settings():
    return render_template('settings.html')

@main.route('/sell')
@login_required
def sell():
    return render_template('sell.html')


@main.route('/market')
@login_required
def market():
    return render_template('market.html', balance=current_user.balance)

# @main.route('/getAllBooks')
# @login_required
# def getAllBooks():
#     books = Book.query.all()
#     inventory = Inventory.query.all()
#     retBooks = []
#     for book in books:
#         bookDet = {
#             "id": book.id,
#             "name": book.name,
#             "isbn": book.isbn,
#             "imagepath": book.imagepath,
#         }
#         ownerCount = 0
#         prices = []
#         for inv in inventory:
#             if book.id == inv.bookId:
#                 ownerCount += 1
#                 prices.append(inv.price)

#         bookDet["ownerCount"] = ownerCount
#         bookDet["minPrice"] = min(prices)
#         bookDet["maxPrice"] = max(prices)

#         if ownerCount: # do not include if there are no owners
#             retBooks.append(bookDet)
        
#     return {"books": retBooks}

# @main.route('/getBookOwners')
# @login_required
# def getBookOwners():
#     id = int(request.args.get('id'))

#     inventory = Inventory.query.all()
#     owners = []
#     for inv in inventory:
#         if inv.bookId == id:
#             user = User.query.filter_by(id=inv.ownerId).first()
#             if user:
#                 owners.append({
#                     "email": user.email,
#                     "name": user.name,
#                     "condition": inv.condition,
#                     "price": inv.price
#                 })
#     return {"owners": owners}