import { useEffect, useState } from "react";

import MovieList, {Movie} from "./MovieList"

import "./DiscoverMovies.css"

function DiscoverMovies() {
    // This page uses the base api-call of the "movies" route
    const [movies, setMovies] = useState<Movie[]>([]);
    useEffect(() => {
        const fetchMovies = async (): Promise<void> => {
            try {
                const response = await fetch("http://localhost:5000/movies/");
                const data = await response.json();
                setMovies(data);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            }
        };
        fetchMovies().then();
    }, []);
    // Use the MovieList component to display the movies
    return(
        <div className="main-div">
            <h1> Discover the latest popular movies!</h1>
            <MovieList movies={movies}/>
        </div>
    )
}

export default DiscoverMovies;