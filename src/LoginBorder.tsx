import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import {useSession} from "./SessionContext";

import "./LoginBorder.css"

interface LoginBorderProps{
    handleLogin: () => void;
}

const LoginBorder:React.FC<LoginBorderProps> = ({handleLogin}) => {
    const loggedIn = useSession().loggedIn;
    const [showPopUp, setShowPopUp] = useState(false);
    const handleClick = () => {
        if (!loggedIn) {
          setShowPopUp(true);
          setTimeout(() => {
            handleLogin(); // Wait 2 seconds before handling the login so the user sees the pop-up
          }, 2000)
        }
    };
    // If logged in, add button that allows the user to view their favourites
    const navigate = useNavigate();
    const handleFavouritesClick = () => {
        navigate("/movies/favourites");
    };
    return(
        <div className="login-border">
            <h1 className="border-title">🎬 Axel's Movie App 🎀</h1>
            <button className="login-button" disabled={loggedIn} onClick={handleClick}>
                {loggedIn ? "Logged in" : "Login"}
            </button>
            {loggedIn && (
              <button className="favourites-button" onClick={handleFavouritesClick}>
                ⭐ Favourites
              </button>
            )}
            {showPopUp && !loggedIn && (
                <>
                    <div className="login-popup-overlay"/>
                    <div className="login-popup">
                      A new tab will open. Please click "Accept" to log in.
                    </div>
                </>
            )}
        </div>
    )
}

export default LoginBorder;