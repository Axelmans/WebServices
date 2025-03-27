import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MovieList, {Movie} from "./MovieList"
import LoginBorder from "./LoginBorder";

import "./PopularMovies.css"

// This page is the same as "Discover", but features buttons to set the value "n" in [1, 20]
// It can initially be loaded with any n-value in this range
function PopularMovies() {
    // useLocation allows to grab a given n-value
    const location = useLocation();
    const [n, setN] = useState<number>(() => {
            const param = Number(new URLSearchParams(location.search).get('n'));
            // if the given parameter n is not a number or smaller than 1: set it to 1
            if(isNaN(param) || param < 1) return 1;
            // if it is larger than 20, set it to 20
            if(param > 20) return 20;
            // otherwise a valid value given
            return param;
        }
    );
    // functions that handle button presses
    const handlePlus = () => setN(n + 1);
    const handleMinus = () => setN(n - 1);
    const [movies, setMovies] = useState<Movie[]>([]);
    useEffect(() => {
        const fetchMovies = async (): Promise<void> => {
            try {
                const response = await fetch(`http://localhost:5000/movies/popular?n=${n}`);
                const data = await response.json();
                setMovies(data);
            }
            catch (error) {
                console.error("Failed to fetch movies:", error);
            }
        };
        fetchMovies().then();
    }, [n]);
    // Use the MovieList component to display the movies
    return(
        <div>
          <LoginBorder/>
          <h1> Discover the latest popular movies! </h1>
          <div className="buttons">
            <button onClick={handleMinus} className="button-1" disabled={n === 1}>-</button>
              <div className="field">
                  {n}
              </div>
            <button onClick={handlePlus} className="button-2" disabled={n === 20}>+</button>
          </div>
          <MovieList movies={movies} />
        </div>
    )
}

export default PopularMovies;