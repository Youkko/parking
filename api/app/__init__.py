import os
import logging
from datetime import timedelta

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_object: str | object = None) -> Flask:
    """
    App factory. Pass config object path (e.g. 'app.config.Config')
    or let it read from environment.
    """
    app = Flask(__name__, instance_relative_config=False)
    CORS(
        app,
        supports_credentials=True,
        origins=["*"],
        #origins=["http://localhost:82"],
        methods=["GET", "POST", "PATCH", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Authorization"]
    )
    if config_object:
        app.config.from_object(config_object)
    else:
        app.config.from_object(os.getenv('FLASK_CONFIG', 'app.config.Config'))

    app.config.setdefault('SQLALCHEMY_ENGINE_OPTIONS', {
        'pool_pre_ping': True,
        # tune pool_size and max_overflow for your workload in production
    })

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    if not app.logger.handlers:
        handler = logging.StreamHandler()
        handler.setLevel(app.config.get('LOG_LEVEL', logging.INFO))
        formatter = logging.Formatter('[%(asctime)s] %(levelname)s in %(module)s: %(message)s')
        handler.setFormatter(formatter)
        app.logger.addHandler(handler)
        app.logger.setLevel(app.config.get('LOG_LEVEL', logging.INFO))

    # Register blueprints
    from app.routes.auth import auth
    app.register_blueprint(auth, url_prefix='/auth')

    from app.routes.park import park
    app.register_blueprint(park, url_prefix='/park')

    # Flask CLI helpers
    @app.cli.command("create-db")
    def create_db():
        """Create database tables (development convenience)."""
        from flask import current_app
        current_app.logger.info("Creating database tables...")
        with app.app_context():
            db.create_all()
        current_app.logger.info("DB tables created.")

    return app