import React, {useState} from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./MovieCard.css"

// This is the main information of interest of a movie
interface MovieCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  isAdult: boolean;
  genres: string[];
  rating: number;
  runtime: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ id, title, description, image, isAdult, genres, rating, runtime }) => {
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const getRatingColor = (rating: number) => {
    if (rating >= 6.5) return 'green';
    if (rating >= 5) return 'orange';
    return 'red';
  };
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  const navigate = useNavigate();
  const handleNavigateToGenres = (movie_id: number) => {
    navigate(`/movies/same_genres?movie_id=${movie_id}`);
  };
  const handleNavigateToRunTime = (movie_id: number) => {
    navigate(`/movies/similar_run_time?movie_id=${movie_id}`);
  }
  return (
    <>
        <Card className="movie-card" onClick={handleShowModal}>
          <Card.Img variant="top" src={image}/>
        </Card>
        {/* The modal opens when clicking on the card, it shows additional information */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {title}
                {isAdult && (
                  <span className="modal-adult-span">
                    18+
                  </span>
                )}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
              <div className="img-div">
                <img
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
            <Modal.Footer>
              <Button variant="primary" disabled>
                Favourite
              </Button>
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