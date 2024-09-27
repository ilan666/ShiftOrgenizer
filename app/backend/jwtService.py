
from datetime import datetime, timedelta
from functools import wraps
from flask import current_app, jsonify, request
import jwt

# Function to generate JWT token
def generate_token(user_id):
    expiration = datetime.now() + timedelta(hours=1)  # Token expires in 1 hour
    token = jwt.encode({'user_id': user_id, 'exp': expiration}, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token

# Function to decode and verify JWT token
def decode_token(token):
    try:
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return data
    except jwt.ExpiredSignatureError:
        return {'message': 'Token has expired.'}, 401
    except jwt.InvalidTokenError:
        return {'message': 'Invalid token.'}, 401
    
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            # Remove 'Bearer ' from the token if it is there
            token = token.replace('Bearer ', '')
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            request.user_id = payload['user_id']  # Attach user_id to request for further use
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token.'}), 401

        return f(*args, **kwargs)

    return decorated