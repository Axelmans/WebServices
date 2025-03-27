import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MovieList, {Movie} from "./MovieList";
import LoginBorder from "./LoginBorder";

import "./SimilarRuntime.css"

function SimilarRuntime () {
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
                const response = await fetch(`http://localhost:5000/movies/similar_run_time?movie_id=${refID}`);
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
            <h1> Movies with similar runtime as ... </h1>
            <MovieList movies={movies}/>
        </div>
    );
}

export default SimilarRuntime;