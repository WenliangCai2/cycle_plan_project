"""
Authentication controller
"""
import uuid
from flask import jsonify, request
from models.user import User

# Dictionary to store user sessions
USER_SESSIONS = {}

def register():
    """User registration"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Check if username exists
    existing_user = User.get_user_by_username(username)
    if existing_user:
        return jsonify({
            'success': False,
            'message': 'Username already exists'
        }), 400
    
    # Create new user
    user = User.create_user(username, password)
    if not user:
        return jsonify({
            'success': False,
            'message': 'Registration failed'
        }), 500
    
    # Generate token
    token = str(uuid.uuid4())
    USER_SESSIONS[token] = user.user_id
    
    return jsonify({
        'success': True,
        'message': 'Registration successful',
        'token': token,
        'userId': user.user_id
    })

def login():
    """User login"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Find user
    user = User.get_user_by_username(username)
    if not user:
        return jsonify({
            'success': False,
            'message': 'User does not exist'
        }), 401
    
    # Verify password
    if not user.verify_password(password):
        return jsonify({
            'success': False,
            'message': 'Incorrect password'
        }), 401
    
    # Generate token
    token = str(uuid.uuid4())
    USER_SESSIONS[token] = user.user_id
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'token': token,
        'userId': user.user_id
    })

def verify_session(request):
    """Verify user session"""
    token = request.headers.get('Authorization')
    if not token or token not in USER_SESSIONS:
        return None
    
    user_id = USER_SESSIONS[token]
    user = User.get_user_by_id(user_id)
    return user_id if user else None

def logout():
    """User logout"""
    token = request.headers.get('Authorization')
    if token and token in USER_SESSIONS:
        del USER_SESSIONS[token]
        return jsonify({
            'success': True,
            'message': 'Logout successful'
        })
    return jsonify({
        'success': False,
        'message': 'Not logged in or session expired'
    }), 401 