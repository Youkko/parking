from app import db
from argon2 import PasswordHasher
from werkzeug.security import check_password_hash, generate_password_hash

ph = PasswordHasher()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

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
