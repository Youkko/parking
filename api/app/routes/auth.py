from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError

from app import db
from app.models import User

auth = Blueprint('auth', __name__)

def _bad_request(msg="Bad request"):
    return jsonify({"message": msg}), 400

@auth.route('/register', methods=['POST'])
def register():
    """
    Expected JSON: {"email": "...", "password": "..."}
    """
    data = request.get_json(silent=True)
    if not data:
        return _bad_request("Invalid JSON payload")

    email = (data.get('email') or '').strip().lower()
    password = data.get('password')
    if not email or not password:
        return _bad_request("Both 'email' and 'password' are required")

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Email already exists'}), 409
    except Exception as exc:
        current_app.logger.exception("Failed to create user")
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500

    return jsonify({'message': 'User created'}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    if not data:
        return _bad_request("Invalid JSON payload")

    email = (data.get('email') or '').strip().lower()
    password = data.get('password')
    if not email or not password:
        return _bad_request("Both 'email' and 'password' are required")

    #user = User.query.filter_by(email=email).first()
    user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid credentials'}), 401

    additional_claims = {"email": user.email, "created_at": user.created_at.isoformat()}
    access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
    return jsonify(access_token=access_token), 200