import "./App.css";
import Header from "./components/header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import MovieDetails from "./components/MovieDetails";
import MovieSearch from "./components/MovieSearch";
import PublicPlaylist from "./components/PublicPlaylist";
import PrivatePlaylist from "./components/PrivatePlaylist";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Header
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
        />
        <Routes>
          <Route path="/" element={<MovieSearch />} />
          <Route path="/search" element={<MovieSearch />} />
          <Route path="/movie-details/:imdbID" element={<MovieDetails />} />
          <Route path="/public-playlist" element={<PublicPlaylist />} />
          <Route path="/private-playlist" element={<PrivatePlaylist />} />
          <Route
            path="/login"
            element={<LoginForm setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/signup"
            element={<SignupForm setIsLogin={setIsLogin} />}
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
