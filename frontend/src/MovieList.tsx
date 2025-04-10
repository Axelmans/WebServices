import {FC, useEffect, useState} from "react";
import "./MovieList.css"
import MovieCard from "./MovieCard";

/* This is a component to properly display a list of movies */

// Interface matches data-structure of movies returned by TMDB, not all these attributes are useful
export interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    genres: string[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    runtime: number;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface Movies {
    movies: Movie[];
}

const image_base_url = "https://image.tmdb.org/t/p/w500";

const MovieList: FC<Movies> =  ({ movies }) => {
    const[moviesExtraInfo, setMoviesExtraInfo] = useState<Movie[]>(movies);
    // Genres and runtime need to be fetched manually as not all TMDB API-calls include it
    useEffect(() => {
        const fetchMovieDetails = async () => {
            const requests = movies.map(async (movie) => {
                const res = await fetch(`http://localhost:5000/movies/${movie.id}/`);
                const data = await res.json();
                return {
                    ...movie,
                    runtime: data.runtime,
                    // Genres should store the names, not the id's
                    genres: data.genres.map((g: { name: string }) => g.name),
                };
            });
            const results = await Promise.all(requests);
            setMoviesExtraInfo(results);
        };
        fetchMovieDetails().then();
    }, [movies]);
    return(
        <div>
             <section className="movie-list">
                {moviesExtraInfo.map((movie) => (
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    description={movie.overview}
                    image={image_base_url + movie.poster_path}
                    adult={movie.adult}
                    genres={movie.genres}
                    rating={movie.vote_average}
                    runtime={movie.runtime}
                  />
                ))}
             </section>
        </div>
    )
}

export default MovieList;