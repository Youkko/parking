from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import verify_jwt_in_request
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from app import db
from app.models import Movement, Price, Vehicle

park = Blueprint('park', __name__)

@park.before_request
def require_jwt():
  public_endpoints = [
    'park.list_movements',
    'park.list_prices',
    'park.register_arrival',
    'park.update_departure'
  ]
  if request.endpoint not in public_endpoints:
    verify_jwt_in_request()

def _bad_request(msg="Bad request"):
  return jsonify({"message": msg}), 400

@park.route('/', methods=['GET'])
def list_movements():
  try:
    movements = Movement.query.order_by(Movement.arrival.desc()).all()
    result = []
    for m in movements:
      result.append({
        "id": str(m.id),
        "plate": m.plate,
        "arrival": m.arrival.isoformat(),
        "departure": m.departure.isoformat() if m.departure else None,
        "duration_seconds": m.duration(),
        "price": m.price if m.departure else None
      })
    return jsonify(result), 200
  except SQLAlchemyError as exc:
    current_app.logger.exception("Failed to list movements")
    return jsonify({"message": "Internal server error"}), 500

@park.route('/arrive', methods=['POST'])
def register_arrival():
  data = request.get_json(silent=True)
  if not data or 'plate' not in data:
    return _bad_request("Field 'plate' is required")

  plate = data.get('plate').strip().upper()
  if not plate:
    return _bad_request("Invalid 'plate'")

  try:
    open_movement = Movement.query.filter_by(plate=plate, departure=None).first()
    if open_movement:
      return jsonify({"message": "Vehicle already inside"}), 409

    movement = Movement(plate=plate, arrival=datetime.now(timezone.utc))
    db.session.add(movement)
    db.session.commit()
    return jsonify({"message": "Arrival registered", "id": str(movement.id)}), 201
  except SQLAlchemyError:
    db.session.rollback()
    current_app.logger.exception("Failed to register arrival")
    return jsonify({"message": "Internal server error"}), 500

@park.route('/depart', methods=['PATCH'])
def update_departure():
  data = request.get_json(silent=True)
  if not data or 'plate' not in data:
    return _bad_request("Field 'plate' is required")

  plate = data.get('plate').strip().upper()
  try:
    movement = Movement.query.filter_by(plate=plate, departure=None).first()
    if not movement:
      return jsonify({"message": "No active entry found for this plate"}), 404

    movement.departure = datetime.now(timezone.utc)
    movement.price = calculate_price(movement.plate, movement.duration())
    db.session.commit()

    return jsonify({
      "message": "Departure updated successfully",
      "plate": movement.plate,
      "departure_time": movement.departure.isoformat(),
      "duration_seconds": movement.duration(),
      "price": movement.price
    }), 200

  except SQLAlchemyError:
    db.session.rollback()
    current_app.logger.exception("Failed to update parking stay data")
    return jsonify({"message": "Internal server error"}), 500
  
@park.route('/prices', methods=['GET'])
def list_prices():
  try:
    prices = Price.query.order_by(Price.created_at.asc()).all()
    result = []

    for p in prices:
      result.append({
        "id": str(p.id),
        "description": p.description,
        "grace": p.grace,
        "value_fraction": float(p.value_fraction),
        "value_hour": float(p.value_hour),
        "value_day": float(p.value_day),
        "created_at": p.created_at.isoformat()
      })

    return jsonify(result), 200

  except SQLAlchemyError:
    current_app.logger.exception("Failed to list prices")
    return jsonify({"message": "Internal server error"}), 500
  
def calculate_price(plate: str, duration_seconds: float) -> float:
  try:
    duration_seconds = float(duration_seconds)
  except Exception:
    return 0.0

  if duration_seconds <= 0:
    return 0.0

  plate = (plate or "").strip().upper()
  if not plate:
    return 0.0

  vehicle = Vehicle.query.filter_by(plate=plate, is_active=True).first()

  if vehicle is None:
    price_row = Price.query.filter_by(description="Unregistered vehicle").first()
  else:
    if vehicle.is_motorcycle:
      price_row = Price.query.filter_by(description="Registered motorcycle").first()
    else:
      price_row = Price.query.filter_by(description="Registered car").first()

  if price_row is None:
    return 0.0

  value_day = Decimal(price_row.value_day)
  value_hour = Decimal(price_row.value_hour)
  value_fraction = Decimal(price_row.value_fraction)
  grace_minutes = getattr(price_row, "grace", 0) or 0

  grace_seconds = Decimal(grace_minutes) * Decimal(60)

  duration = Decimal(duration_seconds)

  if duration <= grace_seconds:
    return 0.0

  total = value_hour

  remaining = duration - Decimal(3600)
  if remaining <= 0:
    return float(total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))

  hours_total = remaining / Decimal(3600)

  days = int(hours_total // Decimal(24))
  remaining_hours = hours_total - (Decimal(days) * Decimal(24))

  full_hours = int(remaining_hours // Decimal(1))
  frac = remaining_hours - Decimal(full_hours)

  total += value_day * Decimal(days)
  total += value_hour * Decimal(full_hours)

  if frac > 0:
    total += value_fraction

  total = total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
  return float(total)