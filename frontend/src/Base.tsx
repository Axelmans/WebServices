import React from "react";
import {useNavigate} from "react-router-dom";

import "./Base.css"

function Base() {
    const navigate = useNavigate();
    const handleNavigateToDiscover = () => {
        navigate(`/movies`);
    };
    return(
        <div className="main-div">
            <h1> Welcome to Axel's Movie Website!</h1>
            <div className="discover-div">
                <h1> Press the button below to discover popular movies! </h1>
                <button className="discover-button" onClick={handleNavigateToDiscover}>Discover</button>
            </div>
        </div>
    )
}

export default Base;