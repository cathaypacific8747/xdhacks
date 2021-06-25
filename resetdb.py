from project import db, create_app
from project.models import Book, Inventory, User
import os
import csv

# attempt to delete the old database
path = 'project/db.sqlite'
success = False
if os.path.exists(path):
    try:
        os.remove(path)
        success = True
    except:
        pass

# and create a new database with default data
if success:
    app = create_app()
    with app.app_context():
        db.create_all()

        # insert data from csv

        # with open('project/static/csv/users.csv', 'r+', newline='') as f:
        #     data = list(csv.reader(f))
        #     for d in data[1:]:
        #         u = User(id=int(d[0]), email=d[1], name=d[2], password=d[3], balance=int(d[4]))
        #         db.session.add(u)
        #     db.session.commit()

        # with open('project/static/csv/books.csv', 'r+', newline='') as f:
        #     data = list(csv.reader(f))
        #     for d in data[1:]:
        #         b = Book(id=int(d[0]), name=d[1], isbn=int(d[2]), imagepath=d[3])
        #         db.session.add(b)
        #     db.session.commit()

        # with open('project/static/csv/inventory.csv', 'r+', newline='') as f:
        #     data = list(csv.reader(f))
        #     for d in data[1:]:
        #         i = Inventory(id=int(d[0]), bookId=int(d[1]), ownerId=int(d[2]), price=int(d[3]), condition=int(d[4]))
        #         db.session.add(i)
        #     db.session.commit()
else:
    print('Database removal failed. Try doing it manually.')