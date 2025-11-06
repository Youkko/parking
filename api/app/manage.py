from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

# Configuração básica Flask + SQLAlchemy
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://hello_flask:hello_flask@db:5432/hello_flask_dev')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Importa o modelo User definido
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)

# Função para criar as tabelas
def create_db():
    with app.app_context():
        db.create_all()
        print("Banco de dados e tabelas criados.")

if __name__ == '__main__':
    create_db()
