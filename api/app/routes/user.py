from flask import Blueprint, request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app import db
from app.models import User, Vehicle

user = Blueprint('user', __name__)

@user.before_request
def require_jwt():
  public_endpoints = []
  if request.endpoint not in public_endpoints:
    verify_jwt_in_request()

def _bad_request(msg="Bad request"):
  return jsonify({"message": msg}), 400

def _not_found(msg="Not found"):
  return jsonify({"message": msg}), 404

def _forbidden(msg="Forbidden"):
  return jsonify({"message": msg}), 403

@user.route("/", methods=["GET"])
def get_user_info():
  user_id = get_jwt_identity()
  u = User.query.filter_by(id=user_id, is_active=True).first()

  if not u:
    return _not_found("User does not exist")
  
  active_vehicles = (
      Vehicle.query
      .filter_by(owner_id=u.id, is_active=True)
      .all()
  )

  vehicles = [
    {
      "plate": v.plate,
      "is_motorcycle": v.is_motorcycle,
      "created_at": v.created_at.isoformat(),
      "is_active": v.is_active
    }
    for v in active_vehicles
  ]

  return jsonify({
    "id": str(u.id),
    "email": u.email,
    "name": u.name,
    "created_at": u.created_at.isoformat(),
    "vehicles": vehicles
  })

@user.route("/", methods=["PATCH"])
def update_user():
  user_id = get_jwt_identity()
  u = User.query.filter_by(id=user_id, is_active=True).first()

  if not u:
    return _not_found("User does not exist")

  data = request.json or {}
  name = data.get("name")
  email = data.get("email")
  password = data.get("password")
  newpassword = data.get("newpassword")

  if not password:
    return _bad_request("Missing 'password'")

  if not u.check_password(password):
    return _forbidden("Invalid password")

  if name is not None:
    u.name = name.strip() or None

  if email is not None:
    email = email.strip()
    if not email:
      return _bad_request("Invalid email")
    u.email = email

  if newpassword:
    newpassword = newpassword.strip()
    if newpassword:
      u.set_password(newpassword)

  db.session.commit()

  return jsonify({"message": "User updated successfully"})

@user.route("/", methods=["DELETE"])
def delete_user():
  user_id = get_jwt_identity()
  u = User.query.filter_by(id=user_id, is_active=True).first()

  if not u:
    return _not_found("User does not exist")

  data = request.json or {}
  password = data.get("password")

  if not password:
    return _bad_request("Missing 'password'")

  if not u.check_password(password):
    return _forbidden("Invalid password")

  u.is_active = False

  for v in u.vehicles:
    v.is_active = False

  db.session.commit()

  return jsonify({"message": "User deleted successfully"})

@user.route("/vehicle", methods=["POST"])
def add_vehicle():
  user_id = get_jwt_identity()
  u = User.query.filter_by(id=user_id, is_active=True).first()

  if not u:
    return _not_found("User does not exist")

  data = request.json or {}

  plate = data.get("plate")
  is_motorcycle = data.get("is_motorcycle")

  if not plate or not isinstance(plate, str):
    return _bad_request("Missing or invalid 'plate'")

  plate = plate.strip().upper()

  if is_motorcycle is None:
    return _bad_request("Missing 'is_motorcycle'")

  existing = Vehicle.query.filter_by(plate=plate, is_active=True).first()
  if existing:
    return _bad_request("Vehicle with this plate already exists")

  v = Vehicle(
    owner_id=u.id,
    plate=plate,
    is_motorcycle=bool(is_motorcycle)
  )

  db.session.add(v)
  db.session.commit()

  return jsonify({"message": "Vehicle added successfully"})

@user.route("/vehicle", methods=["DELETE"])
def delete_vehicle():
  user_id = get_jwt_identity()
  u = User.query.filter_by(id=user_id, is_active=True).first()

  if not u:
    return _not_found("User does not exist")

  data = request.json or {}
  plate = data.get("plate")

  if not plate:
    return _bad_request("Missing 'plate'")

  plate = plate.strip().upper()

  v = Vehicle.query.filter_by(owner_id=u.id, plate=plate, is_active=True).first()

  if not v:
    return _not_found("Vehicle not found")

  v.is_active = False
  db.session.commit()

  return jsonify({"message": "Vehicle deleted successfully"})