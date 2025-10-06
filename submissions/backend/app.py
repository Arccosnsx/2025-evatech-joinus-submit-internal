from flask import Flask, request, jsonify
from database import db, User
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    if not User.query.first():
        sample_users = [
            User(name='Alan', birthday=20061007,
                 phone='13800138000', email='alan@example.com'),
            User(name='Bob', birthday=19950815,
                 phone='13900139000', email='bob@example.com'),
        ]
        db.session.bulk_save_objects(sample_users)
        db.session.commit()


def make_response(code, status, data=None):
    res = {
        "code": code,
        "status": status
    }
    if data is not None:
        res["data"] = data
    return jsonify(res)


@app.route('/ping', methods=['GET'])
def ping():
    return make_response(200, "OK", {"msg": "pong"})


@app.route('/calc', methods=['POST'])
def calc():
    try:
        req = request.get_json()
        n1 = req.get('num1')
        n2 = req.get('num2')
        op = req.get('op')

        if n1 is None or n2 is None or op is None:
            return make_response(400, "Bad Request")

        n1 = float(n1)
        n2 = float(n2)
        op = int(op)

        if op == 1:
            res = n1 + n2
        elif op == 2:
            res = n1 - n2
        elif op == 3:
            res = n1 * n2
        elif op == 4:
            if n2 == 0:
                return make_response(400, "Divide by Zero")
            res = n1 / n2
        else:
            return make_response(400, "Invalid Operation")

        return make_response(200, "OK", {"res": res})

    except Exception as e:
        return make_response(500, "Server Error")


@app.route('/birth', methods=['GET'])
def get_birth():
    name = request.args.get('name')
    if not name:
        return make_response(400, "Name required")

    user = User.query.filter_by(name=name).first()
    if user:
        return make_response(200, "OK", user.to_dict())
    else:
        return make_response(404, "User not found")


@app.route('/birth', methods=['POST'])
def add_birth():
    try:
        req = request.get_json()
        name = req.get('name')
        birthday = req.get('birthday')
        phone = req.get('phone')
        email = req.get('email')

        if not name or not birthday:
            return make_response(400, "Name and birthday required")

        if not phone and not email:
            return make_response(400, "Phone or email required for verification")

        if User.query.filter_by(name=name).first():
            return make_response(409, "User already exists")

        if phone and User.query.filter_by(phone=phone).first():
            return make_response(409, "Phone already exists")

        if email and User.query.filter_by(email=email).first():
            return make_response(409, "Email already exists")

        new_user = User(
            name=name,
            birthday=birthday,
            phone=phone,
            email=email
        )

        db.session.add(new_user)
        db.session.commit()

        return make_response(201, "Created", new_user.to_dict())

    except Exception as e:
        db.session.rollback()
        return make_response(500, "Server Error")


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
