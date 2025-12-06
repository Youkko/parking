import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Numeric
from app import db

class Price(db.Model):
  __tablename__ = 'prices'

  id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  description = db.Column(db.String(50), unique=True, nullable=False, index=True)
  grace = db.Column(Numeric(10, 0), nullable=False)
  value_fraction = db.Column(Numeric(10, 2), nullable=False)
  value_hour = db.Column(Numeric(10, 2), nullable=False)
  value_day = db.Column(Numeric(10, 2), nullable=False)
  created_at = db.Column(
    db.DateTime,
    default=lambda: datetime.now(timezone.utc),
    nullable=False
  )

  def __repr__(self):
    return (
      f"<Price id={self.id} "
      f"description={self.description!r} "
      f"grace={self.grace} "
      f"value_fraction={self.value_fraction} "
      f"value_hour={self.value_hour} "
      f"value_day={self.value_day} "
      f"created_at={self.created_at.isoformat()}>"
    )