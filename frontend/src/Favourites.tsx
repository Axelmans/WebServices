import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import MovieList, {Movie} from "./MovieList"

import {useSession} from "./SessionContext";

import "./Favourites.css"

function Favourites() {
    // This page fetches favourite movies
    const favourites = useSession().favourites;
    const [movies, setMovies] = useState<Movie[]>([]);
    useEffect(() => {
        const fetchMovies = async (): Promise<void> => {
            try {
                const response = await fetch(`http://localhost:5000/movies/favourites`);
                const data = await response.json();
                setMovies(data);
            }
            catch (error) {
                console.error("Failed to fetch movies:", error);
            }
        };
        fetchMovies().then();
    }, [favourites]);
    // For some reason, this page also requires to fetch extra info manually
    const[moviesExtraInfo, setMoviesExtraInfo] = useState<Movie[]>(movies);
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
    const navigate = useNavigate();
    const handleNavigateToDiscover = () => {
        navigate(`/movies`);
    };
    // Allow the user to generate a barplot of their favourite movies
    // The modal will show this barplot
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const [barplot, setBarplot] = useState<string | null>(null);
    const handleBarPlot = async () => {
        const movie_ids_string = favourites.join(",");
        const response = await fetch(`http://localhost:5000/movies/barplot?movie_ids=${movie_ids_string}`);
        const blob = await response.blob();
        setBarplot(URL.createObjectURL(blob));
        handleShowModal();
    }
    // Use the MovieList component to display the movies
    return(
        <>
            <div className="main-div">
                <h1> Your Favourite Movies <Button
                    className="barplot-button" onClick={handleBarPlot} disabled={favourites.length === 0}> Barplot
                </Button>
                </h1>
                {/* If no favourites, display a message and add a button to discover movies */}
                {movies.length === 0 ? (
                        <div className="no-favourites">
                            <h1>No Favourites Found. Add some!</h1>
                            <button className="discover-button" onClick={handleNavigateToDiscover}> Discover </button>
                        </div>
                    ) : (
                        <MovieList movies={moviesExtraInfo}/>
                    )
                }
            </div>
            {/* Modal to show a barplot of the favourites */}
            <Modal show={showModal} onHide={handleCloseModal} centered dialogClassName="custom-modal">
                <Modal.Header closeButton>
                  <Modal.Title>
                    Barplot of your favourite movies
                  </Modal.Title>
                </Modal.Header>
                 <Modal.Body className="modal-body">
                  <div className="img-div">
                    <img src={barplot as string} alt="barplot"/>
                  </div>
                 </Modal.Body>
            </Modal>
        </>
    )
}

export default Favourites;