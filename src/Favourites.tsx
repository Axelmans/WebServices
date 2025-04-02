import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import MovieList, {Movie} from "./MovieList"

import {useSession} from "./SessionContext";

import "./Favourites.css"

function Favourites() {
    // This page fetches favourite movies
    const loggedIn = useSession().loggedIn;
    const sessionID = useSession().sessionID;
    const favourites = useSession().favourites;
    const [movies, setMovies] = useState<Movie[]>([]);
    useEffect(() => {
        if(!loggedIn || sessionID === null) return; // only run function if logged in and a session id exists
        const fetchMovies = async (): Promise<void> => {
            try {
                const response = await fetch(`http://localhost:5000/movies/favourites?session_id=${sessionID}`);
                const data = await response.json();
                setMovies(data);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            }
        };
        fetchMovies().then();
    }, [loggedIn, sessionID, favourites]);
    const navigate = useNavigate();
    const handleNavigateToDiscover = () => {
        navigate(`/movies`);
    };
    // Use the MovieList component to display the movies
    return(
        <div>
            <h1> Your Favourite Movies </h1>
            {/* If no favourites, display a message and add a button to discover movies */}
            {movies.length === 0 ? (
                    <div className="no-favourites">
                        <h1>No Favourites Found. Add some!</h1>
                        <button className="discover-button" onClick={handleNavigateToDiscover}> Discover </button>
                    </div>
                ) : (
                    <MovieList movies={movies}/>
                )
            }
        </div>
    )
}

export default Favourites;