"""
MongoDB database configuration file
"""
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# MongoDB Atlas connection URI
MONGO_URI = "mongodb+srv://<username>:<password>...@cluster0.bdi7u.mongodb.net/route_planner?retryWrites=true&w=majority"

# Collection names
USERS_COLLECTION = 'users'
CUSTOM_POINTS_COLLECTION = 'custom_points'
ROUTES_COLLECTION = 'routes'


db = None 