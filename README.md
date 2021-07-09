# xdhacks

[![CodeFactor](https://www.codefactor.io/repository/github/cathaypacific8747/xdhacks/badge/main?s=d3edd417b3e9f6023f6f201ea5dcf58b3e7c16ba)](https://www.codefactor.io/repository/github/cathaypacific8747/xdhacks/overview/main)

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
- [x] User Template - Server side validation and sanitizing.
- [ ] User Template - Read-only mode

- [x] Sell API
- [ ] Sell API - Validate file size and type
- [x] Sell Template - Google Books API
- [x] Sell Template - Price, Condition
- [x] Sell Template - Upload Image
- [x] Sell Template - Descriptors
- [x] Sell Template - handle Upload Logic
- [x] Sell Template - fix radio

- [ ] Listing API - Get all user's listing (GET `/api/v1/listing/detail`)
- [ ] Listing API - Get listing detail by id (GET `/api/v1/book/detail?bookId=_`)
- [ ] Listing API - Get all books with matching ISBN (GET `/api/v1/book/search?isbn=_`)
- [ ] Listing API - Get all books with matching name (GET `/api/v1/book/search?name=_`)
- [ ] Listing API - Get all book details (GET `/api/v1/book/list`)
- [ ] Book Template

- [x] Optimise Error Handling Algorithm
- [ ] Admin accounts (regenDB, inventoryControl)
- [ ] Minify

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
- https://github.com/Igor-ua/python-shared/blob/master/sv_discord/sv_discord.py
- https://stackoverflow.com/questions/55030714/c-python-asyncio-running-discord-py-in-a-thread
- https://stackoverflow.com/questions/1909441/how-to-delay-the-keyup-handler-until-the-user-stops-typing