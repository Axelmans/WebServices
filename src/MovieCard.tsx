import React, { useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./MovieCard.css"
import {useSession} from "./SessionContext";

// This is the main information of interest from a movie
interface MovieCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  adult: boolean;
  genres: string[];
  rating: number;
  runtime: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ id, title, description, image, adult, genres, rating, runtime }) => {

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Depending on the rating score, the rating will be shown on screen in a different colour
  const getRatingColor = (rating: number) => {
    if (rating >= 6.5) return 'green';
    // orange is more visible than yellow
    if (rating >= 5) return 'orange';
    // return red in all other cases
    return 'red';
  };

  // Runtime is given as a number (= amount of minutes)
  // This formats it in hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    // For movies less than an hour long
    if(hours === 0){
      return `${mins}m`;
    }
    return `${hours}h ${mins}m`;
  };

  /* Navigations to other pages:
      1. Movies with same genres of a given movie
      2. Movies with a similar runtime of a given movie
     Added to this component to prevent having to reuse them on each actual page! */
  const navigate = useNavigate();
  const handleNavigateToGenres = (movie_id: number) => {
    handleCloseModal();
    navigate(`/movies/same_genres?movie_id=${movie_id}`);
  };
  const handleNavigateToRunTime = (movie_id: number) => {
    handleCloseModal();
    navigate(`/movies/similar_run_time?movie_id=${movie_id}`);
  }

  const {
    favourites,
    setFavourites
  } = useSession();

  const handleSetFavourite = async (movie_id: number) => {
    try{
      await fetch(`http://localhost:5000/movies/favourite?movie_id=${movie_id}`, {method: 'POST'});
      setFavourites([...favourites, id]);
      handleCloseModal();
    }
    catch(error){
      console.log("Failed to favourite movie: ", error);
    }
  }
  const handleRemoveFavourite = async (movie_id: number) => {
    try {
      await fetch(`http://localhost:5000/movies/unfavourite?movie_id=${movie_id}`, {
        method: 'POST'
      });
      setFavourites(favourites.filter(id => id !== movie_id));
      handleCloseModal();
    }
    catch (error) {
      console.error("Failed to unfavourite movie:", error);
    }
  }

  return (
    <>
        {/* The cards are shown initially, they only contain the movie poster */}
        <Card className="movie-card" onClick={handleShowModal}>
          <Card.Img variant="top" src={image}/>
        </Card>
        {/* The modal opens when clicking on the card, it shows additional information of the movie */}
        <Modal show={showModal} onHide={handleCloseModal} centered dialogClassName="custom-modal">
            <Modal.Header closeButton>
              <Modal.Title>
                {title}
                {/* TODO: test if this works (keep an eye out for 18+ movies?) */}
                {adult && (
                  <span className="modal-adult-span">
                    18+
                  </span>
                )}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
              <div className="img-div">
                <img className="rounded"
                  src={image}
                  alt={title}
                />
              </div>
              <div className="information-div">
                <h5>Description:</h5>
                <p>{description}</p>
                <h6>Genres:</h6>
                <ul>
                  {genres.map((genre, index) => (
                    <li key={index}>{genre}</li>
                  ))}
                </ul>
                <div className="runtime-div">
                  <h6>Runtime: <span>{formatRuntime(runtime)}</span></h6>
                </div>
                <div className="rating-div">
                  <h6>Rating: <span className="rating-span" style={{ color: getRatingColor(rating)}}>
                        {rating.toFixed(1) + "/10"}
                      </span>
                  </h6>
                </div>
              </div>
            </Modal.Body>
            {/* The buttons are important for much of the required functionality */}
            <Modal.Footer>
              {/*  */}
              {favourites.includes(id) ? (
                <Button variant="primary" onClick={() => handleRemoveFavourite(id)}>
                  Unfavourite
                </Button>
              ) : (
                <Button variant="primary" onClick={() => handleSetFavourite(id)}>
                  Favourite
                </Button>
              )}
              <Button variant="primary" onClick={() => handleNavigateToGenres(id)}>
                Movies with Same Genres
              </Button>
              <Button variant="primary" onClick={() => handleNavigateToRunTime(id)}>
                Movies with Similar Runtime
              </Button>
            </Modal.Footer>
        </Modal>
    </>
  );
};

export default MovieCard;