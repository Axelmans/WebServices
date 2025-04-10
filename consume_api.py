#
# This file tests the API, whether the calls work and return appropriate results
#

import json
import os
import requests
import sys

from app.src.app import create_app

app = create_app()

# Movie used for tests is "A Minecraft Movie"
test_id = 950387

def test_n_movies():
    with app.test_client() as client:
        # Test all valid values [1, 20]
        for n in range(1, 21):
            response = client.get(f"/movies/popular?n={n}")
            assert response.status_code == 200
            # Amount of returned movies should equal n
            assert len(response.get_json()) == n
        # A value outside the range should return code 400
        response = client.get(f"/movies/popular?n={26}")
        assert response.status_code == 400

def test_same_genres():
    with app.test_client() as client:
        test_movie_response = client.get(f"/movies/{test_id}/")
        test_movie_data = test_movie_response.get_json()
        test_movie_genre_ids = [genre['id'] for genre in test_movie_data['genres']]
        response = client.get(f"/movies/{test_id}/similar/genres")
        assert response.status_code == 200
        # For each movie in the results, check if it has, at minimum, all the same genres as the test movie
        for movie in response.get_json():
            genre_intersection = [genre for genre in test_movie_genre_ids if genre in movie['genre_ids']]
            assert genre_intersection == test_movie_genre_ids

def test_similar_runtime():
    with app.test_client() as client:
        # NOTE: This request takes into account all translations of the input movie
        # Results might have a bigger difference if any translations differ in runtime compared to the original
        # There is no way to filter on region or language at this time
        response = client.get(f"/movies/{test_id}/similar/runtime")
        assert response.status_code == 200

def test_barplot():
    with app.test_client() as client:
        # Check if this request returns an image
        response = client.get(f"/movies/barplot?movie_ids={test_id}")
        assert response.status_code == 200
        assert response.content_type == "image/png"

def test_favourites():
    # NOTE: the tests seem to take local storage into account, tests should be adapted to that
    with app.test_client() as client:
        # Add the test id to favourites, verify it was added in the back of the list
        response = client.post(f"/movies/{test_id}/favourite")
        assert response.status_code == 200
        favourites_response = client.get(f"/movies/favourites")
        assert favourites_response.status_code == 200
        favourites = favourites_response.get_json()
        assert favourites[len(favourites)-1]["id"] == test_id
        # Then, unfavourite again and verify it was deleted from the list
        unfavourite = client.post(f"/movies/{test_id}/unfavourite")
        assert unfavourite.status_code == 200
        favourites_response = client.get(f"/movies/favourites")
        assert favourites_response.status_code == 200
        favourites = favourites_response.get_json()
        # The list should be empty or the last item should have a different id
        assert len(favourites) == 0 or favourites[len(favourites)-1]["id"] != test_id

if __name__ == "__main__":
    test_n_movies()
    test_same_genres()
    test_similar_runtime()
    test_barplot()
    test_favourites()
