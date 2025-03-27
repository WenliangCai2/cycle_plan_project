"""
Authentication related routes
"""
from flask import Blueprint
from controllers.auth_controller import register, login, logout

# Create blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api')

# Register route
auth_bp.route('/register', methods=['POST'])(register)

# Login route
auth_bp.route('/login', methods=['POST'])(login)

# Logout route
auth_bp.route('/logout', methods=['POST'])(logout) 