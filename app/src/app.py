# Code was based/taken from the following source:
# https://www.geeksforgeeks.org/implement-a-python-rest-api-with-flask-flasgger/
# https://github.com/flasgger/flasgger
from flasgger import Swagger
from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Api, Resource

from app.src.routes.movies import Movies, Popular, Movie, SameGenres, SimilarRunTime, BarPlot, Favourite, Favourites, Unfavourite

def create_app():
    # General setup
    app = Flask(__name__)
    CORS(app)
    api = Api(app)
    app.config['SWAGGER'] = {
        'title': 'Webservices API',
        'uiversion': 3,
        'version': '1.0.0',
        'description': 'An API for discovering and managing movies using the TMDB API.',
    }
    Swagger(app)
    # Base api-route, returns a dummy string that is not used on frontend
    class Base(Resource):
        @staticmethod
        def get():
            return jsonify("Welcome!")
    # Add all the routes and finally return the app
    api.add_resource(Base, "/", methods=["GET"])
    api.add_resource(Movies, "/movies/", methods=["GET"])
    api.add_resource(Popular, "/movies/popular", methods=["GET"])
    api.add_resource(Movie, "/movies/<int:movie_id>/", methods=["GET"])
    api.add_resource(SameGenres, "/movies/<int:movie_id>/similar/genres", methods=["GET"])
    api.add_resource(SimilarRunTime, "/movies/<int:movie_id>/similar/runtime", methods=["GET"])
    api.add_resource(BarPlot, "/movies/barplot", methods=["GET"])
    api.add_resource(Favourite, "/movies/<int:movie_id>/favourite", methods=["POST"])
    api.add_resource(Unfavourite, "/movies/<int:movie_id>/unfavourite", methods=["POST"])
    api.add_resource(Favourites, "/movies/favourites", methods=["GET"])
    return app
