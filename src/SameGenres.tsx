import {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import MovieList, {Movie} from "./MovieList";
import LoginBorder from "./LoginBorder";

import "./SameGenres.css"

function SameGenres () {
    const location = useLocation();
    const [refID] = useState<number>(() => {
        const param = Number(new URLSearchParams(location.search).get('movie_id'));
        if (isNaN(param) || param <= 0) {
            throw new Error("Invalid movie_id parameter");
        }
        return param;
    });
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
            <LoginBorder/>
            <h1> Discover the latest popular movies! </h1>
            <MovieList movies={movies}/>
        </div>
    );
}

export default SameGenres;