import csv
from project import db, create_app
from project.models import User

app = create_app()
with app.app_context():
    db.create_all()

    with open('project/static/csv/users.csv', 'r+', newline='') as f:
        data = list(csv.reader(f))
        for d in data[1:]:
            u = User(id=int(d[0]), email=d[1], name=d[2], password=d[3], balance=int(d[4]))
            db.session.add(u)
        db.session.commit()