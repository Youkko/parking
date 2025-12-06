import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
from app import db

class Movement(db.Model):
  __tablename__ = 'movements'

  id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  plate = db.Column(db.String(20), nullable=False, index=True)
  arrival = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
  departure = db.Column(db.DateTime(timezone=True), nullable=True)
  price = db.Column(db.Numeric(10, 2), nullable=True)

  def duration(self) -> float:
    end_time = self.departure or datetime.now(timezone.utc)
    delta = end_time - self.arrival
    return delta.total_seconds()

  def __repr__(self):
    return (
      f"<Movement id={self.id} "
      f"plate={self.plate!r} "
      f"arrival={self.arrival.isoformat()} "
      f"departure={self.departure.isoformat() if self.departure else None} "
      f"price={self.price if self.departure else None}>"
    )