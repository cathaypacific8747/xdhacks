from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from os import environ as env
from dotenv import load_dotenv
from oauthlib.oauth2 import WebApplicationClient

load_dotenv()
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config['FLASK_APP'] = env['FLASK_APP']
    app.config['SECRET_KEY'] = env['SECRET_KEY']
    app.config['SQLALCHEMY_DATABASE_URI'] = env['SQLALCHEMY_DATABASE_URI']
    app.config['FLASK_DEBUG'] = env['FLASK_DEBUG']

    app.config['GOOGLE_CLIENT_ID'] = env['GOOGLE_CLIENT_ID']
    app.config['GOOGLE_CLIENT_SECRET'] = env['GOOGLE_CLIENT_SECRET']
    app.config['GOOGLE_DISCOVERY_URL'] = "https://accounts.google.com/.well-known/openid-configuration"

    # setup database
    db.init_app(app)

    # setup login
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    # OAuth2
    app.client = WebApplicationClient(app.config['GOOGLE_CLIENT_ID'])

    from .models import User
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id)) # by pk

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app