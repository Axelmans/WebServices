import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import DiscoverMovies from "./DiscoverMovies";
import Favourites from "./Favourites";
import PopularMovies from "./PopularMovies";
import SameGenres from "./SameGenres"
import SimilarRuntime from "./SimilarRuntime";
import LoginBorder from "./LoginBorder";

import { SessionProvider, useSession } from "./SessionContext";

function MainPage() {
  return (
    <React.StrictMode>
        <SessionProvider>
            <MainContent/>
        </SessionProvider>
    </React.StrictMode>
  );
}

function MainContent() {
    const update = useSession().update;
    const handleLogin = async () => {
        try{
            const response = await fetch("http://localhost:5000/login");
            if(!response.ok){
                console.error("Failed to log in!");
            }
            const data = await response.json();
            update({loggedIn: true, sessionID: data.session_id});
        }
        catch(error){
            console.log("Failed to log in: ", error);
            update({loggedIn: false, sessionID: null});
        }
    }
    return (
        <BrowserRouter>
            {/* Add login border here since each page should contain it */}
            <LoginBorder handleLogin={handleLogin}/>
            <Routes>
                {/* TODO: Create a component for the base route with buttons to various functionalities */}
                <Route path="/" element={<div/>}/>
                <Route path="/movies" element={<DiscoverMovies/>}/>
                <Route path="/movies/popular" element={<PopularMovies/>}/>
                <Route path="/movies/same_genres" element={<SameGenres/>}/>
                <Route path="/movies/similar_run_time" element={<SimilarRuntime/>}/>
                <Route path="/movies/favourites" element={<Favourites/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<MainPage/>);

export default MainPage;