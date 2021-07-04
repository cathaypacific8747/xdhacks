from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from os import environ as env
from dotenv import load_dotenv
from oauthlib.oauth2 import WebApplicationClient
from flask_wtf.csrf import CSRFProtect
from flask_migrate import Migrate
import discord
import asyncio

load_dotenv()
db = SQLAlchemy()
migrate = Migrate()
csrf = CSRFProtect()
login_manager = LoginManager()

# client = discord.Client()
# def startClient():
#     asyncio.set_event_loop(loop)
#     client.run(env['DISCORD_BOT_TOKEN'])

def create_app(run=False):
    app = Flask(__name__)

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config['FLASK_APP'] = env['FLASK_APP']
    app.config['SECRET_KEY'] = env['SECRET_KEY']
    app.config['SQLALCHEMY_DATABASE_URI'] = env['SQLALCHEMY_DATABASE_URI']
    app.config['FLASK_DEBUG'] = env['FLASK_DEBUG']

    app.config['GOOGLE_CLIENT_ID'] = env['GOOGLE_CLIENT_ID']
    app.config['GOOGLE_CLIENT_SECRET'] = env['GOOGLE_CLIENT_SECRET']
    app.config['GOOGLE_DISCOVERY_URL'] = "https://accounts.google.com/.well-known/openid-configuration"

    app.config['DISCORD_BOT_TOKEN'] = env['DISCORD_BOT_TOKEN']
    app.config['DISCORD_STORAGE_CHANNEL_ID'] = env['DISCORD_STORAGE_CHANNEL_ID']

    db.init_app(app)
    from .models import User, Book, Inventory
    migrate.init_app(app, db)
    csrf.init_app(app)

    # setup login
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    # OAuth2
    app.client = WebApplicationClient(app.config['GOOGLE_CLIENT_ID'])

    # discord
    if run:
        app.loop = asyncio.new_event_loop()
        app.discordClient = discord.Client(loop=app.loop, guild_subscriptions=False)
        app.loop.run_until_complete(app.discordClient.login(app.config['DISCORD_BOT_TOKEN']))
        app.loop.create_task(app.discordClient.connect(reconnect=True))

        print('INTIALISED!!! O M G')
    else:
        print('Not initialising.')
    # app.loop = asyncio.get_event_loop()
    # print('TEST')
    # app.loop.run_until_complete(app.discordClient.start(app.config['DISCORD_BOT_TOKEN']))
    # print('TEST')
    # app.discordStorageChannel = app.loop.run_until_complete(app.discordClient.get_channel(app.config['DISCORD_STORAGE_CHANNEL_ID']))
    # print('TEST')
    # print(app.discordStorageChannel)

    from .models import User
    @login_manager.user_loader
    def load_user(uuid):
        return User.query.get(uuid)

    from .auth import auth as auth_blueprint
    from .main import main as main_blueprint
    from .error_handler import err as error_blueprint
    from .api import api as api_blueprint

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(main_blueprint)
    app.register_blueprint(error_blueprint)
    app.register_blueprint(api_blueprint)
    csrf.exempt(api_blueprint) # REMOVE

    return app