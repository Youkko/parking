import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
from app import db
from argon2 import PasswordHasher
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

ph = PasswordHasher()

class User(db.Model):
  __tablename__ = 'users'

  id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  email = db.Column(db.String(255), unique=True, nullable=False, index=True)
  password_hash = db.Column(db.String(255), nullable=False)
  created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

  def __repr__(self):
    return f"<User id={self.id} email={self.email!r}>"

  def set_password(self, password: str) -> None:
    """Always hash with Argon2 for new passwords."""
    self.password_hash = ph.hash(password)

  def check_password(self, password: str) -> bool:
    """
    Verify password supporting both Argon2 and legacy PBKDF2 hashes.
    Automatically upgrades old hashes.
    """
    hash_ = self.password_hash or ""
    # Detect which algorithm
    if hash_.startswith("$argon2"):
      try:
        return ph.verify(hash_, password)
      except Exception:
        return False
    else:
      # legacy werkzeug pbkdf2:sha256
      if check_password_hash(hash_, password):
        try:
          # upgrade to Argon2 transparently
          self.set_password(password)
          db.session.add(self)
          db.session.commit()
        except Exception:
          db.session.rollback()
        return True
      return False

class Movement(db.Model):
  __tablename__ = 'movements'

  id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  plate = db.Column(db.String(20), nullable=False, index=True)
  arrival = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
  departure = db.Column(db.DateTime(timezone=True), nullable=True)  # null while vehicle is inside

  def duration(self) -> float:
    """
    Returns the elapsed time in seconds.
    If departure is None, it calculates to current time.
    """
    end_time = self.departure or datetime.now(timezone.utc)
    delta = end_time - self.arrival
    return delta.total_seconds()

  def __repr__(self):
    return (
      f"<Movement id={self.id} plate={self.plate!r} "
      f"arrival={self.arrival.isoformat()} departure={self.departure.isoformat() if self.departure else None}>"
    )