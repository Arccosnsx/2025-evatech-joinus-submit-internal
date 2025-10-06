from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    birthday = db.Column(db.Integer, nullable=False)
    phone = db.Column(db.String(20), unique=True)
    email = db.Column(db.String(100), unique=True)

    def to_dict(self):
        return {
            'name': self.name,
            'birthday': self.birthday
        }
