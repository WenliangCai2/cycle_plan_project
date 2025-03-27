"""
路线数据模型
"""
import uuid
from datetime import datetime

# This variable will be set in app.py
db = None

class Route:
    def __init__(self, name, locations, user_id, route_id=None):
        self.name = name
        self.locations = locations  # List containing location points
        self.user_id = user_id
        self.route_id = route_id or str(uuid.uuid4())
        self.created_at = datetime.now()
    
    def to_dict(self):
        return {
            'name': self.name,
            'locations': self.locations,
            'user_id': self.user_id,
            'route_id': self.route_id,
            'created_at': self.created_at
        }
    
    @staticmethod
    def from_dict(route_dict):
        route = Route(
            name=route_dict['name'],
            locations=route_dict['locations'],
            user_id=route_dict['user_id'],
            route_id=route_dict['route_id']
        )
        route.created_at = route_dict.get('created_at', datetime.now())
        return route
    
    @staticmethod
    def create_route(name, locations, user_id):
        global db
        if db is None:
            return None
            
        route = Route(name=name, locations=locations, user_id=user_id)
        result = db.routes.insert_one(route.to_dict())
        print(f"success to create ，ID: {route.route_id}")
        return route
    
    @staticmethod
    def get_routes_by_user_id(user_id):
        """get all routes by user id"""
        global db
        if db is None:
            return []
            
        route_dicts = db.routes.find({'user_id': user_id})
        return [Route.from_dict(route_dict) for route_dict in route_dicts]
    
    @staticmethod
    def get_route_by_id(route_id):
        """get a route by id"""
        global db
        if db is None:
            return None
            
        route_dict = db.routes.find_one({'route_id': route_id})
        if route_dict:
            return Route.from_dict(route_dict)
        return None
    
    @staticmethod
    def delete_route(route_id, user_id):
        """delete a route by id"""
        global db
        if db is None:
            return False
            
        result = db.routes.delete_one({'route_id': route_id, 'user_id': user_id})
        return result.deleted_count > 0 