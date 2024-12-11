from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Настройка базы данных
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Модели базы данных
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    fio = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="user")  # Новое поле для роли
    password = db.Column(db.String(100), nullable=False)

# Модель для услуги
class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # Название услуги
    description = db.Column(db.String(500), nullable=True)  # Описание услуги
    price = db.Column(db.Float, nullable=True)  # Цена услуги
    price_unit = db.Column(db.String(50), nullable=True, default="за единицу")  # Единица измерения цены
    vibor = db.Column(db.String(50), nullable=False)  # Категория услуги (например, Бизнес или Технические)
    service_type = db.Column(db.String(50), nullable=False)  # Тип услуги (например, детальный тип услуги)
    is_active = db.Column(db.Boolean, nullable=False, default=True)  # Статус активности услуги

    def __repr__(self):
        return f'<Service {self.name}>'

# Модель для инцидента
class Incident(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    theme = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    service = db.relationship('Service', backref='incidents')
    responsible = db.Column(db.String(200), nullable=True)  # Добавлено поле "Ответственный"
    initiator = db.Column(db.String(200), nullable=True)  # Новое поле
    comment = db.Column(db.Text, nullable=True)  # Новое поле для комментариев
    def __repr__(self):
        return f'<Incident {self.theme}>'

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subject = db.Column(db.String(200), nullable=True)  # Добавлено поле "Тема"
    message = db.Column(db.Text, nullable=False)
    sent_at = db.Column(db.DateTime, server_default=db.func.now())

# Создание базы данных
def setup_database():
    with app.app_context():
        db.create_all()

# Маршруты для пользователей
@app.route('/users', methods=['GET', 'POST'])
def manage_users():
    if request.method == 'GET':
        users = User.query.all()
        return jsonify([{'id': user.id, 'username': user.username, 'fio': user.fio, 'role': user.role, 'password': user.password} for user in users])
    elif request.method == 'POST':
        data = request.json
        new_user = User(username=data['username'], fio=data['fio'], role=data['role'], password=data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully!'})

@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    username = data.get('username')
    fio = data.get('fio')  # Получаем ФИО пользователя
    role = data.get('role')
    password = data.get('password')
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "Пользователь не найден"}), 404
    # Обновляем данные пользователя
    user.username = username
    user.fio = fio  # Здесь заменяем на правильное имя атрибута
    user.role = role
    user.password = password
    try:
        db.session.commit()
        return jsonify({
            'id': user.id,
            'username': user.username,
            'fio': user.fio,  # Отправляем обновленное ФИО
            'role': user.role,
            'password': user.password
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Ошибка при обновлении пользователя: {str(e)}"}), 500

# Удаление пользователя
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Пользователь не найден"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Пользователь успешно удален"}), 200

# Получение всех услуг
@app.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    return jsonify([{
        'id': service.id,
        'name': service.name,
        'vibor': service.vibor,
        'service_type': service.service_type,
        'description': service.description,
        'price': service.price,
        'price_unit': service.price_unit
    } for service in services])

# Добавление новой услуги
@app.route('/services', methods=['POST'])
def add_service():
    data = request.json
    if not data or not data.get("vibor") or not data.get("name") or not data.get("service_type") or not data.get("description") or not data.get("price") or not data.get("price_unit"):
        return jsonify({"error": "Некорректные данные"}), 400

    new_service = Service(
        name=data["name"],
        vibor=data["vibor"],
        service_type=data["service_type"],
        description=data["description"],
        price=data["price"],
        price_unit=data["price_unit"]
    )
    try:
        db.session.add(new_service)
        db.session.commit()
        return jsonify({
            'id': new_service.id,
            'name': new_service.name,
            'vibor': new_service.vibor,
            'service_type': new_service.service_type,
            'description': new_service.description,
            'price': new_service.price,
            'price_unit': new_service.price_unit
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
# Получение услуги по ID
@app.route('/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({"error": "Услуга не найдена"}), 404

    return jsonify({
        "id": service.id,
        "name": service.name,
        "service_type": service.service_type,
        "description": service.description,
        "price": service.price,
        "price_unit": service.price_unit,
        "vibor": service.vibor
    }), 200
# Обновление услуги
@app.route('/services/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    data = request.json
    if not data or not data.get("name") or not data.get("service_type") or not data.get("description") or not data.get("price") or not data.get("price_unit"):
        return jsonify({"error": "Некорректные данные"}), 400

    service = Service.query.get(service_id)
    if not service:
        return jsonify({"error": "Услуга не найдена"}), 404

    service.name = data["name"]
    service.vibor = data.get("vibor", service.vibor)  # Категория услуги
    service.service_type = data["service_type"]
    service.description = data["description"]
    service.price = data["price"]
    service.price_unit = data["price_unit"]
    try:
        db.session.commit()
        return jsonify({"message": "Услуга обновлена"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Удаление услуги
@app.route('/services/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({"error": "Услуга не найдена"}), 404
    try:
        db.session.delete(service)
        db.session.commit()
        return jsonify({"message": "Услуга удалена"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/incidents', methods=['GET'])
def get_incidents():
    incidents = Incident.query.all()
    response = []
    for incident in incidents:
        service = Service.query.get(incident.service_id)  # Получаем название услуги
        response.append({
            'id': incident.id,
            'theme': incident.theme,
            'status': incident.status,
            'service_name': service.name if service else None,  # Возвращаем имя услуги
            'responsible': incident.responsible,
            'initiator': incident.initiator,
            'comment': incident.comment
        })
    return jsonify(response), 200

@app.route('/incidents/<int:incident_id>', methods=['GET'])
def get_incident(incident_id):
    incident = Incident.query.get(incident_id)
    if not incident:
        return jsonify({'error': 'Инцидент не найден'}), 404

    service = Service.query.get(incident.service_id)
    return jsonify({
        'id': incident.id,
        'theme': incident.theme,
        'status': incident.status,
        'service_id': incident.service_id,
        'service_name': service.name if service else None,
        'responsible': incident.responsible,
        'initiator': incident.initiator,
        'comment': incident.comment
    }), 200

@app.route('/incidents', methods=['POST'])
def create_incident():
    data = request.json
    new_incident = Incident(
        theme=data['theme'],
        status=data['status'],
        service_id=data['service_id'],
        responsible=data['responsible'],
        initiator=data['initiator'],
        comment=data.get('comment', '')  # Получаем комментарий
    )
    db.session.add(new_incident)
    db.session.commit()
    return jsonify({'message': 'Инцидент создан'}), 201


@app.route('/incidents', methods=['POST'])
def add_incident():
    data = request.json
    if not data.get('theme') or not data.get('status') or not data.get('service_id'):
        return jsonify({'error': 'Некорректные данные'}), 400

    new_incident = Incident(
        theme=data['theme'],
        status=data['status'],
        service_id=data['service_id'],
        responsible=data.get('responsible'),
        initiator=data.get('initiator'),
        comment=data.get('comment')  # Обработка поля комментарий
    )
    db.session.add(new_incident)
    db.session.commit()
    return jsonify({'message': 'Инцидент добавлен'}), 201

@app.route('/incidents/<int:incident_id>', methods=['PUT'])
def update_incident(incident_id):
    data = request.json
    incident = Incident.query.get(incident_id)

    if not incident:
        return jsonify({'error': 'Инцидент не найден'}), 404

    incident.theme = data.get('theme', incident.theme)
    incident.status = data.get('status', incident.status)
    incident.service_id = data.get('service_id', incident.service_id)
    incident.responsible = data.get('responsible', incident.responsible)
    incident.initiator = data.get('initiator', incident.initiator)
    incident.comment = data.get('comment', incident.comment)  # Обновление комментария

    db.session.commit()
    return jsonify({'message': 'Инцидент обновлен'}), 200


# Удаление инцидента
@app.route('/incidents/<int:id>', methods=['DELETE'])
def delete_incident(id):
    incident = Incident.query.get(id)
    if not incident:
        return jsonify({"error": "Инцидент не найден"}), 404

    db.session.delete(incident)
    db.session.commit()
    return jsonify({"message": "Инцидент успешно удален"}), 200

@app.route('/messages', methods=['POST'])
def create_message():
    data = request.json
    new_message = Message(
        sender_id=data['sender'],
        receiver_id=data['receiver'],
        message=data['message']
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify({"message": "Message sent successfully"}), 201

@app.route('/messages', methods=['GET'])
def get_messages():
    messages = Message.query.all()
    return jsonify([{
        'id': msg.id,
        'sender_id': msg.sender_id,
        'receiver_id': msg.receiver_id,
        'subject': msg.subject,
        'message': msg.message,
        'sent_at': msg.sent_at
    } for msg in messages])

@app.route('/auth/get_role', methods=['POST'])
def get_user_role():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.password == password:
        return jsonify({"role": user.role}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.password == data['password']:
        return jsonify({"message": "Login successful", "role": user.role, "fio": user.fio}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401



@app.route('/messages/<int:id>', methods=['PUT'])
def update_message(id):
    data = request.json
    message = Message.query.get(id)
    if not message:
        return jsonify({"error": "Сообщение не найдено"}), 404

    message.content = data.get('content', message.content)
    db.session.commit()

    return jsonify({"message": "Сообщение обновлено"}), 200

@app.route('/messages/<int:id>', methods=['DELETE'])
def delete_message(id):
    message = Message.query.get(id)
    if not message:
        return jsonify({"error": "Сообщение не найдено"}), 404

    db.session.delete(message)
    db.session.commit()
    return jsonify({"message": "Сообщение удалено"}), 200
@app.route('/dialog', methods=['GET'])
def get_dialog():
    user1 = request.args.get('user1')
    user2 = request.args.get('user2')

    if not user1 or not user2:
        return jsonify({"error": "Both user1 and user2 must be specified."}), 400

    messages = Message.query.filter(
        ((Message.sender_id == user1) & (Message.receiver_id == user2)) |
        ((Message.sender_id == user2) & (Message.receiver_id == user1))
    ).order_by(Message.sent_at).all()

    return jsonify([
        {
            "id": msg.id,
            "sender": msg.sender_id,
            "receiver": msg.receiver_id,
            "message": msg.message,
            "sent_at": msg.sent_at.isoformat()
        }
        for msg in messages
    ])

if __name__ == '__main__':
    setup_database()
    app.run(debug=True)
