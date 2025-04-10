from flask import Flask, jsonify, request, send_file, Response
from flask_restful import Resource
import io
import json
import os
import requests
from requests.exceptions import RequestException


# TMDB base URL
base_url = "https://api.themoviedb.org/3/"
# TMDB credentials
headers = json.load(open("app/credentials.json", 'r'))['headers']

functionalities = ["Discover" "Popular", "Favourites"]

# Base api-route for "movies"
class Movies(Resource):
    @staticmethod
    def get():
        """
        Get the most popular movies!
        ---
        responses:
          200:
            description: OK
          500:
            description: Failed to retrieve data from TMDB API
        """
        try:
            response = requests.get(f"{base_url}discover/movie", headers=headers)
            return response.json()["results"]
        except RequestException:
            return jsonify({"error": "Failed to fetch movies from TMDB."}), 500

# Functionality 1: Get the most popular movies (parameter n in [1, 20] specifies how many)
class Popular(Resource):
    @staticmethod
    def get():
        """
        Get the "n" most popular movies!
        ---
        parameters:
        - name: n
          in: query
          required: true
          type: integer
          minimum: 1
          maximum: 20
          description: number of most popular movies to be returned
        responses:
          200:
            description: OK
          400:
            description: Invalid input value for parameter "n"
          500:
            description: Failed to retrieve data from TMDB API
        """
        try:
            # get movies
            response = requests.get(f"{base_url}discover/movie?sort_by=popularity.desc", headers=headers)
            # get the value of the parameter 'n'
            n = int(request.args.get("n"))
            if not 1 <= n <= 20:
                return {"error": "Parameter \"n\" must be between 1 and 20, got {}".format(n)}, 400
            movies = response.json()["results"][:n]
            return jsonify(movies)
        except RequestException:
            return jsonify({"error": "Failed to fetch popular movies from TMDB."}), 500


# A route to get a movie of a certain ID
class Movie(Resource):
    @staticmethod
    def get(movie_id):
        """
        Get the movie with the given id
        ---
        parameters:
        - name: movie_id
          in: path
          required: true
          type: integer
          description: the id of the movie to search movies with similar genres from
        responses:
          200:
            description: OK
          500:
            description: Failed to retrieve data from TMDB API
        """
        movie_response = requests.get(f"{base_url}movie/{movie_id}", headers=headers)
        movie_data = movie_response.json()
        return jsonify(movie_data)


# Functionality 2: Get movies with the same genres as a given movie (takes a movie id as input)
class SameGenres(Resource):
    @staticmethod
    def get(movie_id):
        """
        Get movies with similar genres as the movie with the given input id.
        ---
        parameters:
        - name: movie_id
          in: path
          required: true
          type: integer
          description: the id of the movie to search movies with similar genres from
        responses:
          200:
            description: OK
          500:
            description: Failed to retrieve data from TMDB API
        """
        try:
            movie_response = requests.get(f"{base_url}movie/{movie_id}", headers=headers)
            movie_data = movie_response.json()
            # get the genres and use it to discover movies that share these genres
            genres = movie_data["genres"]
            genres_str = ""
            for i in range(len(genres)):
                genres_str += str(genres[i]["id"])
                if i != len(genres) - 1:
                    genres_str += ","
            same_genres_response = requests.get(f"{base_url}discover/movie?with_genres={genres_str}", headers=headers)
            same_genres = same_genres_response.json()["results"]
            # the results should not contain the given movie
            similar_movies = [movie for movie in same_genres if movie["id"] != int(movie_id)]
            return jsonify(similar_movies)
        except RequestException:
            return jsonify({"error": "Failed to fetch movies with same genres from TMDB."}), 500

# Functionality 3: Get movies with a similar runtime as a given movie (takes a movie id as input)
class SimilarRunTime(Resource):
    @staticmethod
    def get(movie_id):
        """
        Get movies with a similar runtime as the movie with the given input id.
        ---
        parameters:
        - name: movie_id
          in: path
          required: true
          type: integer
          description: the id of the movie to search movies with similar genres from
        responses:
          200:
            description: OK
          500:
            description: Failed to retrieve data from TMDB API
        """
        try:
            movie_response = requests.get(f"{base_url}movie/{movie_id}", headers=headers)
            movie_data = movie_response.json()
            # get its runtime and determine the range of "similar" runtimes
            movie_run_time = movie_data["runtime"]
            run_time_min = movie_run_time - 10
            run_time_max = movie_run_time + 10
            # this range can be used as a filter in the discover/movie call:
            # gte = greater than or equal to: minimum
            # lte = less than or equal to: maximum
            similar_run_time_response = requests.get(
                f"{base_url}discover/movie?with_run_time.gte={run_time_min}&with_run_time.lte={run_time_max}",
                headers=headers)
            similar_run_time = similar_run_time_response.json()["results"]
            # again, the results should not contain the given movie itself
            similar_run_time_movies = [movie for movie in similar_run_time if movie["id"] != int(movie_id)]
            return jsonify(similar_run_time_movies)
        except RequestException:
            return jsonify({"error": "Failed to fetch movies with similar runtime."}), 500

# Functionality 4: Generate a bar-plot of the average scores of given movies (takes movie id's as input)
class BarPlot(Resource):
    @staticmethod
    def get():
        """
        Get a barplot of the ratings of the set of movies with the given set of input id's.
        ---
        parameters:
        - name: movie_ids
          in: query
          required: true
          type: string
          description: the id's of the movies for which to generate a barplot, each id separated by a comma
        responses:
          200:
            description: OK.
          500:
            description: Failed to retrieve data from TMDB API or generate plot using Quickchart.
        """
        # get the given movie id's and fetch the data for each movie
        # default: 13 (= Forrest Gump), 155 (= The Dark Knight), 299534 (= Avengers Endgame)
        movie_ids = request.args.get("movie_ids").split(",")
        movie_names = []
        movie_ratings = []
        for movie_id in movie_ids:
            # following comment is to make pycharm ignore the except being too "general"
            # noinspection PyBroadException
            try:
                movie_response = requests.get(f"{base_url}movie/{movie_id}", headers=headers)
                movie_names.append(movie_response.json()["title"])
                movie_ratings.append(movie_response.json()["vote_average"])
            # should the response fail, ignore this movie_id
            except:
                continue
        # plot is generated using the quickchart api
        quickchart_data = {
            "type": "bar",
            "data": {
                "labels": movie_names,
                "datasets": [{
                    "label": "Average Rating",
                    "data": movie_ratings
                }],
            }
        }
        response = requests.get(f"https://quickchart.io/chart?c={json.dumps(quickchart_data)}")
        return Response(response.content, mimetype='image/png')

# Functionality 5: Be able to favourite and unfavourite movies, as well as check favourited movies
class Favourite(Resource):
    @staticmethod
    def post(movie_id):
        """
        Favourite the movie with the given input id.
        ---
        parameters:
        - name: movie_id
          in: path
          required: true
          type: integer
          description: the id of the movie to search movies with similar genres from
        responses:
          200:
            description: OK
          500:
            description: Failed to execute POST request on TMDB API
        """
        try:
            account_id_response = requests.get(f"{base_url}account", headers=headers)
            account_id_data = account_id_response.json()
            account_id = account_id_data["id"]
            payload = {
                "media_type": "movie",
                "media_id": movie_id,
                "favorite": True
            }
            response = requests.post(f"{base_url}account/{account_id}/favorite", json=payload, headers=headers)
            return response.json(), 200
        except RequestException:
            return jsonify({"error": "Failed to favourite movie on TMDB."}), 500

class Unfavourite(Resource):
    @staticmethod
    def post(movie_id):
        """
        Unfavourite the movie with the given input id.
        ---
        parameters:
        - name: movie_id
          in: path
          required: true
          type: integer
          description: the id of the movie to search movies with similar genres from
        responses:
          200:
            description: OK.
          500:
            description: Failed to execute POST request on TMDB API.
        """
        try:
            account_id_response = requests.get(f"{base_url}account", headers=headers)
            account_id_data = account_id_response.json()
            account_id = account_id_data["id"]
            payload = {
                "media_type": "movie",
                "media_id": movie_id,
                "favorite": False
            }
            response = requests.post(f"{base_url}account/{account_id}/favorite", json=payload, headers=headers)
            return response.json(), 200
        except RequestException:
            return jsonify({"error": "Failed to unfavourite movie on TMDB."}), 500


# Get a list of movies marked as favourite
class Favourites(Resource):
    @staticmethod
    def get():
        """
        Get a list of the user's favourite movies.
        ---
        parameters:
        - name: session_id
          in: query
          required: true
          type: string
          description: the id of the user's session
        responses:
          200:
            description: OK.
          500:
            description: Failed to retrieve data from TMDB API.
        """
        try:
            account_id_response = requests.get(f"{base_url}account", headers=headers)
            account_id_data = account_id_response.json()
            account_id = account_id_data["id"]
            response = requests.get(f"{base_url}account/{account_id}/favorite/movies", headers=headers)
            movie_data = response.json()
            return jsonify(movie_data["results"])
        except RequestException:
            return jsonify({"error": "Failed to fetch favourites from TMDB."}), 500
