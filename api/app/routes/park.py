from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timezone
from app import db
from app.models import Movement

park = Blueprint('park', __name__)

def _bad_request(msg="Bad request"):
    return jsonify({"message": msg}), 400

@park.route('/', methods=['GET'])
@jwt_required()
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
                "duration_seconds": m.duration()
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
        # Verifica se o veículo já está dentro (sem departure)
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
        db.session.commit()

        return jsonify({
            "message": "Departure updated successfully",
            "plate": movement.plate,
            "departure_time": movement.departure.isoformat(),
            "duration_seconds": movement.duration(),
        }), 200

    except SQLAlchemyError:
        db.session.rollback()
        current_app.logger.exception("Failed to update parking stay data")
        return jsonify({"message": "Internal server error"}), 500
