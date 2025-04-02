import {FC, useEffect, useState} from "react";
import "./MovieList.css"
import MovieCard from "./MovieCard";

/* This is a component to properly display a list of movies */

// Interface matches data-structure of movies returned by TMDB, not all these attributes are useful
export interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
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

export interface Movies{
    movies: Movie[];
}

const base_url = "https://api.themoviedb.org/3/";
const image_base_url = "https://image.tmdb.org/t/p/w500";
const genres_url = "https://api.themoviedb.org/3/genre/movie/list?api_key=";

const MovieList: FC<Movies> =  ({ movies }) => {
    const [genresMap, setGenresMap] = useState<{ [key: number]: string }>({});
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const key_response = await fetch("/credentials.json");
                const key_data = await key_response.json();
                const genres_response = await fetch(genres_url + key_data["key"]);
                const genres_data = await genres_response.json();
                const genreMap: { [key: number]: string } = {};
                genres_data.genres.forEach((genre: { id: number, name: string }) => {
                    genreMap[genre.id] = genre.name;
                });
                setGenresMap(genreMap);
            } catch (error) {
                console.error("Failed to fetch genres", error);
            }
        };
        fetchGenres().then();
    }, []);
    const getGenresByIds = (genreIds: number[]): string[] => {
        return genreIds.map(id => genresMap[id] || "Unknown");
    };
    // Runtimes must be fetched manually
    const [moviesWithRuntime, setMoviesWithRuntime] = useState<Movie[]>([]);
    useEffect(() => {
        const fetchMovieRuntimes = async () => {
            try {
                const key_response = await fetch("/credentials.json");
                const key_data = await key_response.json();
                const updatedMovies = await Promise.all(
                    movies.map(async (movie) => {
                        try {
                            const response = await fetch(
                                `${base_url}movie/${movie.id}?api_key=${key_data["key"]}`
                            );
                            const data = await response.json();
                            return { ...movie, runtime: data.runtime };
                        } catch (error) {
                            console.error(`Failed to fetch runtime for movie ${movie.id}`, error);
                            return { ...movie, runtime: 0 }; // Default to 0 if it fails
                        }
                    })
                );
                setMoviesWithRuntime(updatedMovies);
            } catch (error) {
                console.error("Failed to fetch runtimes: ", error);
            }
        };
        fetchMovieRuntimes().then();
    }, [movies]);
    return(
        <div>
             <section className="movie-list">
                {moviesWithRuntime.map((movie) => (
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    description={movie.overview}
                    image={image_base_url + movie.poster_path}
                    adult={movie.adult}
                    genres={getGenresByIds(movie.genre_ids)}
                    rating={movie.vote_average}
                    runtime={movie.runtime}
                  />
                ))}
             </section>
        </div>
    )
}

export default MovieList;