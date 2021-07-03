# xdhacks

A place for us to store code for xdhacks 2021.

## Installation
Setup Postgres
```
$ sudo apt install libpq-dev python3-dev
$ sudo apt-get update
$ sudo apt-get -y install postgresql
$ sudo service postgresql restart # if error
$ sudo -u postgres psql
postgres=# CREATE DATABASE flask;
postgres=# \password postgres
postgres=# \q
```

Migration commands
```
$ flask db init
$ flask db migrate
$ flask db upgrade
```

Run flask
```
$ . venv/bin/activate
$ pip3 install -r requirements.txt
$ openssl req -x509 -newkey rsa:4096 -nodes -out keys/cert.pem -keyout keys/key.pem -days 365
$ gunicorn -c wsgi_config_debug.py wsgi:app
```
or
```
$ chmod +x *.sh
$ source venv.sh
$ ./setup.sh
$ ./start.sh
```

## Checklist
- [x] Log in with Google
- [ ] Signup
- [x] CSRF Protection, especially during log-in
- [x] User API - Get self detail (GET `/api/v1/user/detail`)
- [x] User API - Get other detail (GET `/api/v1/user/detail?userId=_`)
- [x] User DB - Add `contactInfo` TEXT(300) field in db + bleach.
- [x] User API - Update self detail (POST `/api/v1/user/update`)
- [x] User Template - Read-only
- [x] User Template - Use classes
- [x] User Template - Editable Fields
- [x] Add Toasts for handling API errors.
- [x] Use UUIDs
- [x] Use Postgres
- [ ] User Template - Server side validation and sanitizing.
- [ ] User Template - Read-only mode

- [ ] Book API - Get book detail by id (GET `/api/v1/book/detail?bookId=_`)
- [ ] Book API - Get all books with matching ISBN (GET `/api/v1/book/search?isbn=_`)
- [ ] Book API - Get all books with matching name (GET `/api/v1/book/search?name=_`)
- [ ] Book API - Get all book details (GET `/api/v1/book/list`)
- [ ] Book Template

- [ ] Market API - Sell book (POST `/api/v1/market/sell`)
- [ ] Market API

- [x] Optimise Error Handling Algorithm
- [ ] Admin accounts (regenDB, inventoryControl)

## Before Production Checklist
- [ ] Enforce CKY accounts in `login_google`'s `hd` parameter
- [ ] Remove DEBUG flag in .env
- [ ] SSL certificates
- [ ] Remove useless modules in `requirements.txt`
- [ ] Enable CSRF in API

# References
- https://digitalocean.com/community/tutorials/how-to-add-authentication-to-your-app-with-flask-login
- https://realpython.com/flask-google-login/
- https://codepen.io/P1N2O/pen/pyBNzX
- https://gethalfmoon.com/docs/introduction/
- https://developers.google.com/identity/protocols/oauth2/openid-connect
- https://developers.google.com/people/image-sizing
- https://stackoverflow.com/
- https://codepen.io/gabrielcojea/pen/ExPaBzQ