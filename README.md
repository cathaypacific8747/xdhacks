# xdhacks

A place for us to store code for xdhacks 2021.

## Run info
```
$ . venv/bin/activate
$ pip3 install -r requirements.txt
$ python3 gendb.py
$ openssl req -x509 -newkey rsa:4096 -nodes -out keys/cert.pem -keyout keys/key.pem -days 365
$ gunicorn -c wsgi_config_debug.py wsgi:app
```

## Checklist
[x] Log in with Google
[ ] Signup
[x] CSRF, especially during log-in
[ ] Profile API - Get self (all information)
[ ] Profile API - Get by id (personal information hidden)
[ ] Profile Template

# References
- https://digitalocean.com/community/tutorials/how-to-add-authentication-to-your-app-with-flask-login
- https://realpython.com/flask-google-login/
- https://codepen.io/P1N2O/pen/pyBNzX
- https://gethalfmoon.com/docs/introduction/
- https://developers.google.com/identity/protocols/oauth2/openid-connect
- https://stackoverflow.com/