# xdhacks [![CodeFactor](https://www.codefactor.io/repository/github/cathaypacific8747/xdhacks/badge/main?s=d3edd417b3e9f6023f6f201ea5dcf58b3e7c16ba)](https://www.codefactor.io/repository/github/cathaypacific8747/xdhacks/overview/main)

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
- [x] User Template - Get specific user details
- [x] User Template - Clicking on 'show listings' redirects to Listing Template

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
- [x] Listing Template - Get specific user listing

- [x] Market Template - Get list of googleIds from query
- [x] Market API - Aggregate listings by book id from list of google book ids (GET `/api/v1/market/aggregate?bookids=[____]`)
- [x] Market Template - Show aggregated listings
- [x] Market API - Get all listings with specific book id (GET `/api/v1/listing/detail?bookid=___`)
- [x] Market Sub-template - Basic routings
- [x] Market Sub-template - Show book information from Google
- [x] Market Sub-template - Display all listings offered by that user
- [x] Market Sub-template - Clicking on username redirects to User Template

- [x] Offer API - Create Offer (POST `/api/v1/offer/create` {"listingid": listingid})
- [x] Market Sub-template - Clicking on create offer redirects to Dashboard Template, disables button
- [x] Offer API - Get all buyer and seller offers (GET `/api/v1/offer/detail`)
- [x] Dashboard template - Automatically fetches all buyer and seller offers
- [x] Market Sub-template - If offer is seller, or buyer already has offer, disable create offer button
- [x] Dashboard API - System messages (GET `/api/v1/dashboard/messages`)
- [x] Dashboard template - get messages belonging to user.
- [x] Offer API - Create Offer queries Google for book name, then sends notification to message centre
- [x] Dashboard template - Handle buyer/seller toggle
- [x] Dashboard template - show book information
- [x] Dashboard template - show offer information
- [x] Dashboard template - show buyer/seller information
- [x] Dashboard template - show my information visibility
- [x] Dashboard template - add buyer/seller detection
- [x] Offer API - Toggle Publicity (buyer and seller, PATCH `/api/v1/offer/togglePublicity?offerid=____`)
- [x] Dashboard template - toggle publicity of contact information
- [x] Offer API - Cancel Offer (buyer and seller, DELETE `/api/v1/offer/cancel?offerid=____`)
- [x] Dashboard template - Clicking on cancel offer refreshes page automatically.
- [x] Offer API - Complete Offer (seller only, DELETE `/api/v1/offer/complete?offerid=____`)
- [x] Dashboard template - Clicking on complete offer refreshes page automatically.
- [x] Dashboard template - Manual and automatic updates refreshes box.
- [x] Listing API - Deleting Listing causes all offers to be deleted.
- [x] Listing, Offer API - Delete Listing, Cancel Offer, Complete Offer sends notification to message centre.
- [x] Offer API - Private information granted sends notification to message centre.
- [x] Show error message if user attempted to cancel/complete offers that are no longer avaliable.
- [x] Focus/update previous box if selected.
- [x] Dashboard API - Split notificaton.
- [x] Dashboard Template - Split notificaton.
- [x] Dashboard Template - Automatic notification polling

- [x] All templates - Fix duplicate requests due to multiple event listeners.
- [x] Post-signup redirecting and handling
- [x] Listing Template - Modal box on delete listing
- [x] Market Sub-template - Modal box on create offer
- [x] Make email as private information, toggleable
- [x] Make contact information to be private by default
- [x] Welcome Template
- [x] About us Template
- [x] Help Template - Stress user responsibility!
- [ ] Base and Help Template - Quick links to help
- [x] Privacy Policy Template
- [x] Terms of service Template
- [x] I agree to TOS and privacy policy confirmation in Signup Template
- [x] disallow web crawlers with robots.txt
- [x] /favicon.ico
- [x] Flask-Mail
- [x] Fix notification bug
- [x] Remove buyer/seller toggle
- [x] Settings Template - Add email notifications toggle
- [x] Messages API - Add email with Flask-Mail

## Enhancements

- [ ] Show unsupported browser warning for mobile.
- [ ] Make relative time from now update dynamically
- [ ] Site-wide notification polling.
- [ ] Email notification
- [ ] Market API: Book Sort and Listing sort and filter
- [ ] Cache Book Names, ISBNs and use full-text search for Market Template
- [ ] Image override if image isn't avaliable
- [ ] Upgrade short polling to SSE
- [ ] Add statistics to homepage, etc. user count, book count, successful transfer count
- [ ] Admin accounts (regenDB, inventoryControl)
- [ ] Conform to REST standards
- [x] Optimise Error Handling Algorithm
- [ ] Remove useless modules in `requirements.txt`

- [ ] About us - add email
- [ ] Listing Negotiable instead of user negotiable
- [ ] Modal for enabling public information
- [ ] email notification
- [ ] Book list
- [ ] Other schools

## Production Checklist
- [x] Enable CSRF in API
- [ ] Remove DEBUG flag in .env
- [ ] Flask-Assets (minify)
- [ ] Flask-Compress (gzip)
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