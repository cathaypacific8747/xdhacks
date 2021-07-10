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
- [ ] Post-signup redirecting and handling
- [x] CSRF Protection, especially during log-in
- [x] User API - Get self detail (GET `/api/v1/user/detail`)
- [x] User API - Get other detail (GET `/api/v1/user/detail?userId=_`)
- [x] User DB - Add `contactInfo` TEXT(300) field in db + bleach.
- [x] User API - Update self detail (PATCH `/api/v1/user/update`)
- [x] User Template - Read-only
- [x] User Template - Use classes
- [x] User Template - Editable Fields
- [x] Add Toasts for handling API errors.
- [x] Use UUIDs
- [x] Use Postgres
- [x] User Template - Server side validation and sanitizing.
- [ ] User Template - Get specific user details
- [ ] User Template - Clicking on 'show listings' redirects to Listing Template

- [x] Listing API - Upload (POST `/api/v1/listing/upload`)
- [x] Listing API - Validate file size and type
- [x] Sell Template - Google Books API
- [x] Sell Template - Price, Condition
- [x] Sell Template - Upload Image
- [x] Sell Template - Descriptors
- [x] Sell Template - handle Upload Logic
- [x] Sell Template - fix radio
- [x] Sell Template - add no image avaliable

- [x] Listing API - Get user's listing (GET `/api/v1/listing/detail?userId=<  >`)
- [x] Listing Template - Get user's listing
- [x] Listing Template - Open image
- [x] Listing API - Set visibility (PUT `/api/v1/listing/toggleOpen?listingId=___`)
- [x] Listing Template - Set visibility
- [x] Listing API - Delete listing (DELETE `/api/v1/listing/delete?listingId=___`)
- [x] Listing Template - Delete listing
- [ ] Listing Template - Get specific user listing

- [ ] Market Template - Get list of googleIds from query
- [ ] Market API - Aggregate listings by book id from list of google book ids (GET `/api/v1/market/aggregate?bookids=[____]`)
- [ ] Market Template - Show aggregated listings
- [ ] Market API - Get all listings with specific book id (GET `/api/v1/listing/search?bookid=___`)
- [ ] Market Template - Clicking on username redirects to User Template

- [ ] Chat API (Flask-SocketIO, new blueprint?)
- [ ] Chat Template - Basic send/recieve
- [ ] Chat Template - Notifications

- [ ] How to use website Template
- [ ] About us
- [ ] Privacy Policy
- [ ] Terms of service
- [ ] I agree to TOS and privacy policy checkbox in Signup Template

- [x] Optimise Error Handling Algorithm
- [ ] Admin accounts (regenDB, inventoryControl)
- [ ] Minify

## Before Production Checklist
- [ ] Enforce CKY accounts in `login_google`'s `hd` parameter
- [ ] Remove DEBUG flag in .env
- [ ] Enable CSRF in API
- [ ] Remove useless modules in `requirements.txt`
- [ ] SSL certificates

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