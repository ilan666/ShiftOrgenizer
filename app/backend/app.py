from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
import bcrypt
from jwtService import generate_token, decode_token, token_required
import os
from models import db, User, CalendarEntry, Shift

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shiftwise.db'
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default_secret_key') # is this ok? <-
# db = SQLAlchemy(app)
migrate = Migrate(app, db)
db.init_app(app)

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
    
@app.route('/api/users/update-shifts', methods=['POST'])
def update_user_shifts():
    try:
        data = request.get_json()
        username = data.get('username')
        shifts = data.get('selectedShifts', [])

        # Retrieve the user
        user = User.query.filter(func.lower(User.username) == username.lower()).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Update user's selected shifts
        user.selectedShifts = str(shifts)

        # Here you could also update or log to the overall shifts database
        # For this example, converting shifts to string is simple; adapt as needed for complex data

        db.session.commit()
        return jsonify({'message': f'Shifts updated for user {username}'}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': 'An error occurred while saving shifts'}), 500
  
def add_admin_user():
    with app.app_context():
        # Hash the password securely
        password = 'admin'
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        new_admin = User(
            firstname='Admin',
            lastname='admiN',
            username='admin',
            phone=123456789,
            password=hashed_password,
            selectedShifts='',
            currentShifts='',
            color='#FFFFFF',
            isAdmin=True,
            totalShifts=0,
            totalSwitchRequests=0,
            totalAcceptedSwitchRequests=0
        )

        db.session.add(new_admin)
        db.session.commit()
        print("Admin user added successfully!")
          
if __name__ == '__main__':
    with app.app_context():  # Ensure we're in an app context
        db.create_all()  # Creates database tables, if not exists
    # add_admin_user()
    app.run(debug=True)