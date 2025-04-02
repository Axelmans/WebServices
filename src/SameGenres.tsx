import {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import MovieList, {Movie} from "./MovieList";

import "./SameGenres.css"

const base_url = "https://api.themoviedb.org/3/";

function SameGenres () {
    const location = useLocation();
    const [refID, setRefID] = useState<number>(() => {
        const param = Number(new URLSearchParams(location.search).get('movie_id'));
        if (isNaN(param) || param <= 0) {
            throw new Error("Invalid movie id!");
        }
        return param;
    });
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const movieId = Number(queryParams.get("movie_id"));
        setRefID(movieId);
    }, [location.search]);
    const [movieName, setMovieName] = useState<string>()
    useEffect(() => {
        const fetchName = async () => {
            const key_response = await fetch("/credentials.json");
            const key_data = await key_response.json();
            try {
                const response = await fetch(
                    `${base_url}movie/${refID}?api_key=${key_data["key"]}`
                );
                const data = await response.json();
                setMovieName(data["title"]);
            } catch (error) {
                console.error("Failed to fetch movie name:", error);
            }
        }
        fetchName().then();
    })
    const [movies, setMovies] = useState<Movie[]>([]);
    useEffect(() => {
        const fetchMovies = async (): Promise<void> => {
            try {
                const response = await fetch(`http://localhost:5000/movies/same_genres?movie_id=${refID}`);
                const data = await response.json();
                setMovies(data);
            }
            catch (error) {
                console.error("Failed to fetch movies:", error);
            }
        };
        fetchMovies().then();
    }, [refID]);
    return(
        <div>
            <h1> Movies with the same genres as {movieName} </h1>
            <MovieList movies={movies}/>
        </div>
    );
}

export default SameGenres;