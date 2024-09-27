from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
import bcrypt
from jwtService import generate_token, decode_token, token_required
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default_secret_key') # is this ok? <-
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50))
    lastname = db.Column(db.String(50))
    username = db.Column(db.String(50), unique=True)
    phone = db.Column(db.Integer)
    password = db.Column(db.String(60))
    selectedShifts = db.Column(db.String(200))
    currentShifts = db.Column(db.String(200))
    color = db.Column(db.String(20))
    isAdmin = db.Column(db.Boolean, default=False, nullable=False)
    totalShifts = db.Column(db.Integer)
    totalSwitchRequests = db.Column(db.Integer)
    totalAcceptedSwitchRequests = db.Column(db.Integer)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    new_user = User(
        firstname=data['firstname'],
        lastname=data['lastname'],
        username=data['username'],
        phone=data['phone'],
        password=hashed_password,
        selectedShifts=str(data.get('selectedShifts', [])),
        currentShifts=str(data.get('currentShifts', [])),
        color= '#f4f4f4',
        isAdmin = False,
        totalShifts = 0,
        totalSwitchRequests = 0,
        totalAcceptedSwitchRequests = 0 
    )
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify(data), 201

@app.route('/api/users/<username>', methods=['GET'])
def get_user(username):
    username = username.lower()
    user = User.query.filter(func.lower(User.username) == username).first()
    if user:
        return jsonify({
            'id': user.id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'username': user.username,
            'phone': user.phone,
            'selectedShifts': user.selectedShifts,
            'currentShifts': user.currentShifts,
            'color': user.color,
            'isAdmin': user.isAdmin,
            'totalShifts': user.totalShifts,
            'totalSwitchRequests': user.totalSwitchRequests,
            'totalAcceptedSwitchRequests': user.totalAcceptedSwitchRequests
        })
    else:
        return jsonify({'error': 'User not found'}), 404
    
@app.route('/api/users/adminstate', methods=['POST'])
def change_admin_state():
    data = request.get_json()
    username = data.get('username').lower()
    
    try:
        user = User.query.filter(func.lower(User.username) == username).first()
        if user is None:
            return jsonify({'error': 'User not found'}), 404

        user.isAdmin = not user.isAdmin
        db.session.commit()
        
        return jsonify({
            'id': user.id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'username': user.username,
            'phone': user.phone,
            'selectedShifts': user.selectedShifts,
            'currentShifts': user.currentShifts,
            'color': user.color,
            'isAdmin': user.isAdmin,
            'totalShifts': user.totalShifts,
            'totalSwitchRequests': user.totalSwitchRequests,
            'totalAcceptedSwitchRequests': user.totalAcceptedSwitchRequests
        }), 201

    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/users/login', methods=['POST'])
def login():
    data = request.get_json()
    
    username = data.get('username').lower()
    password = data.get('password')

    user = User.query.filter(func.lower(User.username) == username).first()
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password):
        token = generate_token(user.id)  # Generate the token
        return jsonify({'success': True, 'token': token, 'message': 'Login successful'})
    
    return jsonify({'success': False, 'message': 'Invalid username or password'}), 401

@app.route('/api/users/me', methods=['GET'])
@token_required  # Use your authentication decorator
def get_current_user():
    user_id = request.user_id  # Assuming your auth middleware sets this
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'id': user.id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'username': user.username,
            'phone': user.phone,
            'selectedShifts': user.selectedShifts,
            'currentShifts': user.currentShifts,
            'color': user.color,
            'isAdmin': user.isAdmin,
            'totalShifts': user.totalShifts,
            'totalSwitchRequests': user.totalSwitchRequests,
            'totalAcceptedSwitchRequests': user.totalAcceptedSwitchRequests
        })
    return jsonify({'message': 'User not found'}), 404


@app.route('/api/users/remove', methods=['POST'])
def remove_user():
    data = request.get_json()
    username = data.get('username').lower()

    # Find the user by ID
    user = User.query.filter(func.lower(User.username) == username).first()

    if user is None:
        return jsonify({'error': 'User not found'}), 404

    try:
        # Remove the user from the database
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User removed successfully'}), 200
    except Exception as e:
        # Handle exceptions (e.g., rollback if needed)
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    with app.app_context():  # Ensure we're in an app context
        db.create_all()  # Creates database tables, if not exists
    app.run(debug=True)