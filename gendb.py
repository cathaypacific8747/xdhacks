import csv
from project import db, create_app
from project.models import User
import os

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

        with open('project/static/csv/users.csv', 'r+', newline='') as f:
            data = list(csv.reader(f))
            for d in data[1:]:
                u = User(id=int(d[0]), email=d[1], name=d[2], password=d[3], balance=int(d[4]))
                db.session.add(u)
            db.session.commit()
else:
    print('Database removal failed. Try doing it manually.')