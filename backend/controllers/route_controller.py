"""
路线控制器
"""
from flask import jsonify, request
from models.route import Route
from controllers.auth_controller import verify_session

def get_routes():
    """get all routes"""
    user_id = verify_session(request)
    if not user_id:
        return jsonify({
            'success': False, 
            'message': 'not registered user'
        }), 401
    
    # Get all routes for a user
    routes = Route.get_routes_by_user_id(user_id)
    
    # Convert to dictionary list
    route_dicts = [route.to_dict() for route in routes]
    
    return jsonify({
        'success': True,
        'routes': route_dicts
    })

def create_route():
    """create route"""
    user_id = verify_session(request)
    if not user_id:
        return jsonify({
            'success': False, 
            'message': 'not registered user'
        }), 401
    
    data = request.get_json()
    route_data = data.get('route')
    
    if not route_data or 'name' not in route_data or 'locations' not in route_data:
        return jsonify({
            'success': False,
            'message': 'not registered route'
        }), 400
    
    # Create a new route
    route = Route.create_route(
        name=route_data['name'],
        locations=route_data['locations'],
        user_id=user_id
    )
    
    if not route:
        return jsonify({
            'success': False,
            'message': 'failed to create route'
        }), 500
    
    return jsonify({
        'success': True,
        'message': 'success to create route',
        'route': route.to_dict()
    })

def delete_route(route_id):
    """delete route"""
    user_id = verify_session(request)
    if not user_id:
        return jsonify({
            'success': False, 
            'message': 'not registered route'
        }), 401
    
    # Delete a route
    success = Route.delete_route(route_id, user_id)
    
    if not success:
        return jsonify({
            'success': False,
            'message': 'failed to delete route'
        }), 404
    
    return jsonify({
        'success': True,
        'message': 'success to delete route',
    }) 