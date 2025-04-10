import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Base from "./Base";
import DiscoverMovies from "./DiscoverMovies";
import Favourites from "./Favourites";
import SameGenres from "./SameGenres"
import SimilarRuntime from "./SimilarRuntime";
import TopBorder from "./TopBorder";

import { SessionProvider } from "./SessionContext";

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
    return (
        <BrowserRouter>
            {/* Add login border here since each page should contain it */}
            <TopBorder/>
            <Routes>
                {/* TODO: Create a component for the base route with buttons to various functionalities */}
                <Route path="/" element={<Base/>}/>
                <Route path="/movies" element={<DiscoverMovies/>}/>
                <Route path="/movies/:movie_id/similar/genres" element={<SameGenres/>}/>
                <Route path="/movies/:movie_id/similar/runtime" element={<SimilarRuntime/>}/>
                <Route path="/movies/favourites" element={<Favourites/>}/>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<MainPage/>);

export default MainPage;