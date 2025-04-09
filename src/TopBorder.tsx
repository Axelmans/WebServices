import React from "react";
import {useNavigate} from "react-router-dom";

import "./TopBorder.css"

const TopBorder = () => {
    const navigate = useNavigate();
    const handleFavouritesClick = () => {
        navigate("/movies/favourites");
    };
    return(
        <div className="top-border">
            <h1 className="border-title"> <b> AXEL'S MOVIE APP </b> </h1>
              <button className="favourites-button" onClick={handleFavouritesClick}>
                ⭐ <b> Favourites </b>
              </button>
        </div>
    )
}

export default TopBorder;