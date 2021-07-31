from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from os import environ as env
from dotenv import load_dotenv
from oauthlib.oauth2 import WebApplicationClient
from flask_wtf.csrf import CSRFProtect
from flask_migrate import Migrate
from flask_mail import Mail
from flask_assets import Environment
from flask_compress import Compress
import discord
import asyncio
from threading import Thread
import ast
from .bundles import bundles

from werkzeug.wrappers import request

load_dotenv()
db = SQLAlchemy()
migrate = Migrate()
csrf = CSRFProtect()
login_manager = LoginManager()
mail = Mail()
assets = Environment()
compress = Compress()

def create_app(run=False):
    app = Flask(__name__)

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config['FLASK_APP'] = env['FLASK_APP']
    app.config['SECRET_KEY'] = env['SECRET_KEY']
    app.config['SQLALCHEMY_DATABASE_URI'] = env['SQLALCHEMY_DATABASE_URI']
    app.config['FLASK_DEBUG'] = env['FLASK_DEBUG'] == 'True'

    app.config['GOOGLE_CLIENT_ID'] = env['GOOGLE_CLIENT_ID']
    app.config['GOOGLE_CLIENT_SECRET'] = env['GOOGLE_CLIENT_SECRET']
    app.config['GOOGLE_DISCOVERY_URL'] = "https://accounts.google.com/.well-known/openid-configuration"

    app.config['DISCORD_BOT_TOKEN'] = env['DISCORD_BOT_TOKEN']
    app.config['DISCORD_STORAGE_CHANNEL_ID'] = env['DISCORD_STORAGE_CHANNEL_ID']

    app.config['MAIL_SERVER'] = env['MAIL_SERVER']
    app.config['MAIL_PORT'] = env['MAIL_PORT']
    app.config['MAIL_USE_TLS'] = env['MAIL_USE_TLS'] == 'True'
    app.config['MAIL_USE_SSL'] = env['MAIL_USE_SSL'] == 'True'
    app.config['MAIL_USERNAME'] = env['MAIL_USERNAME']
    app.config['MAIL_PASSWORD'] = env['MAIL_PASSWORD']
    app.config['MAIL_DEFAULT_SENDER'] = ast.literal_eval(env['MAIL_DEFAULT_SENDER']) # tuple

    app.config['WTF_CSRF_METHODS'] = ast.literal_eval(env['WTF_CSRF_METHODS']) # tuple
    app.config['WTF_CSRF_CHECK_DEFAULT'] = env['WTF_CSRF_CHECK_DEFAULT'] == 'True'
    
    app.config['COMPRESS_MIMETYPES'] = ast.literal_eval(env['COMPRESS_MIMETYPES'])
    app.config['CLOSURE_COMPRESSOR_OPTIMIZATION'] = env['CLOSURE_COMPRESSOR_OPTIMIZATION']
    app.config['CLOSURE_COMPRESSOR_PATH'] = env['CLOSURE_COMPRESSOR_PATH']
    app.config['CLOSURE_EXTRA_ARGS'] = ast.literal_eval(env['CLOSURE_EXTRA_ARGS'])

    db.init_app(app)
    from .models import User, Listing, Offer
    migrate.init_app(app, db)
    mail.init_app(app)
    csrf.init_app(app)
    assets.init_app(app)
    compress.init_app(app)

    with app.app_context():
        for b in bundles:
            app.logger.info(f'Bundling {b}...')
            assets.register(b, bundles[b])
            bundles[b].build()

    # setup login
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    # OAuth2
    app.client = WebApplicationClient(app.config['GOOGLE_CLIENT_ID'])

    class discordClient(discord.Client):
        async def on_ready(self):
            self.channel = await self.fetch_channel(app.config['DISCORD_STORAGE_CHANNEL_ID'])
            app.logger.info('Discord bot is running.')

    class Threader(Thread):
        def __init__(self):
            Thread.__init__(self)
            self.loop = asyncio.get_event_loop()
            self.start()

        async def starter(self):
            self.client = discordClient(guild_subscriptions=False)
            await self.client.start(app.config['DISCORD_BOT_TOKEN'])

        def run(self):
            self.loop.create_task(self.starter())
            self.loop.run_forever()

    if run:
        app.discordThread = Threader()        

    @login_manager.user_loader
    def load_user(userid):
        return User.query.filter_by(userid=userid).first()

    from .auth import auth as auth_blueprint
    from .main import main as main_blueprint
    from .error_handler import err as error_blueprint
    from .api import api as api_blueprint

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(main_blueprint)
    app.register_blueprint(error_blueprint)
    app.register_blueprint(api_blueprint)

    return app