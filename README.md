# xdhacks

A place for us to store code for xdhacks 2021.

## Run info
```
$ . venv/bin/activate
$ pip3 install -r requirements.txt
$ python3 resetdb.py
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
- [ ] User DB - Add `contactInfo` TEXT(300) field in db + bleach.
- [ ] User API - Update self detail (POST `/api/v1/user/update`)
- [ ] User Template

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

# References
- https://digitalocean.com/community/tutorials/how-to-add-authentication-to-your-app-with-flask-login
- https://realpython.com/flask-google-login/
- https://codepen.io/P1N2O/pen/pyBNzX
- https://gethalfmoon.com/docs/introduction/
- https://developers.google.com/identity/protocols/oauth2/openid-connect
- https://developers.google.com/people/image-sizing
- https://stackoverflow.com/
- https://codepen.io/gabrielcojea/pen/ExPaBzQ