import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieList, {Movie} from "./MovieList";

import "./SameGenres.css"

function SameGenres () {
    const { movie_id } = useParams();
    const [movieName, setMovieName] = useState<string>()
    useEffect(() => {
        const fetchName = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/movies/${movie_id}`
                );
                const data = await response.json();
                setMovieName(data["title"]);
            } catch (error) {
                console.error("Failed to fetch movie name:", error);
            }
        }
        fetchName().then();
    }, [movie_id])
    const [movies, setMovies] = useState<Movie[]>([]);
    useEffect(() => {
        const fetchMovies = async (): Promise<void> => {
            try {
                const response = await fetch(`http://localhost:5000/movies/${movie_id}/similar/genres`);
                const data = await response.json();
                setMovies(data);
            }
            catch (error) {
                console.error("Failed to fetch movies:", error);
            }
        };
        fetchMovies().then();
    }, [movie_id]);
    return(
        <div className="main-div">
            <h1> Movies with the same genres as "{movieName}" </h1>
            <MovieList movies={movies}/>
        </div>
    );
}

export default SameGenres;