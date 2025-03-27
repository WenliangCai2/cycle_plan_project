"""
Routes related routes
"""
from flask import Blueprint
from controllers.route_controller import get_routes, create_route, delete_route

# Create blueprint
route_bp = Blueprint('routes', __name__, url_prefix='/api')

# Get all routes for a user
route_bp.route('/routes', methods=['GET'])(get_routes)

# Create a new route
route_bp.route('/routes', methods=['POST'])(create_route)

# Delete a route
route_bp.route('/routes/<route_id>', methods=['DELETE'])(delete_route) 