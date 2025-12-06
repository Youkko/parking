import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
from app import db

class Vehicle(db.Model):
  __tablename__ = 'vehicles'

  id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

  owner_id = db.Column(
    UUID(as_uuid=True),
    db.ForeignKey('users.id', ondelete="CASCADE"),
    nullable=False,
    index=True
  )

  plate = db.Column(
    db.String(255),
    nullable=False,
    unique=True,
    index=True
  )

  is_motorcycle = db.Column(db.Boolean, nullable=False, default=True)
  is_active = db.Column(db.Boolean, nullable=False, default=True)

  created_at = db.Column(
    db.DateTime,
    default=lambda: datetime.now(timezone.utc),
    nullable=False
  )

  owner = db.relationship("User", back_populates="vehicles")

  def __repr__(self):
    return (
      f"<Vehicle id={self.id} "
      f"owner_id={self.owner_id!r} "
      f"plate={self.plate!r} "
      f"is_motorcycle={self.is_motorcycle} "
      f"created_at={self.created_at.isoformat()}>"
    )