// src/App.js
import "./App.css";
import Header from "./components/header";
import Login from "./components/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import MovieDetails from "./components/MovieDetails";
import MovieSearch from "./components/MovieSearch";
import PublicPlaylist from "./components/PublicPlaylist";
import PrivatePlaylist from "./components/PrivatePlaylist";
import { PlaylistProvider } from "./contexts/PlaylistContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);

  return (
    <PlaylistProvider>
      <Router>
        <ToastContainer />
        <div>
          <Header
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
          />
          <Routes>
            <Route path="/" element={<MovieSearch />} />
            <Route
              path="/login"
              element={
                <Login
                  isLogin={isLogin}
                  setIsLogin={setIsLogin}
                  loggedIn={loggedIn}
                  setLoggedIn={setLoggedIn}
                />
              }
            />
            <Route
              path="/signup"
              element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />}
            />
            <Route path="/search" element={<MovieSearch />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/public-playlist" element={<PublicPlaylist />} />
            <Route path="/private-playlist" element={<PrivatePlaylist />} />
          </Routes>
        </div>
      </Router>
    </PlaylistProvider>
  );
}

export default App;
