import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
from app import db
from argon2 import PasswordHasher
from werkzeug.security import check_password_hash

ph = PasswordHasher()

class User(db.Model):
  __tablename__ = 'users'

  id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  email = db.Column(db.String(255), unique=True, nullable=False, index=True)
  name = db.Column(db.String(255), unique=False, nullable=True)
  password_hash = db.Column(db.String(255), nullable=False)
  is_active = db.Column(db.Boolean, nullable=False, default=True)
  created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
  vehicles = db.relationship(
    "Vehicle",
    back_populates="owner",
    cascade="all, delete-orphan",
    passive_deletes=True
  )

  def __repr__(self):
    return (
      f"<User id={self.id} "
      f"email={self.email!r} "
      f"is_active={self.is_active} "
      f"created_at={self.created_at.isoformat()}>"
    )

  def set_password(self, password: str) -> None:
    self.password_hash = ph.hash(password)

  def check_password(self, password: str) -> bool:
    hash_ = self.password_hash or ""

    # Argon2
    if hash_.startswith("$argon2"):
      try:
        return ph.verify(hash_, password)
      except Exception:
        return False

    # Legacy PBKDF2
    from werkzeug.security import generate_password_hash
    if check_password_hash(hash_, password):
      try:
        self.set_password(password)
        db.session.add(self)
        db.session.commit()
      except Exception:
        db.session.rollback()
      return True
    
    return False