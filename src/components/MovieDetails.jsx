import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";
import Loader from "./Loader";
import { PlaylistContext } from "../contexts/PlaylistContext";
import { ToastContainer, toast } from "react-toastify";

const MovieDetails = () => {
  const { imdbID } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToPrivatePlaylist, addToPublicPlaylist } = useContext(PlaylistContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?i=${imdbID}&apikey=6f1b1840`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setMovieDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(user !== null);
  }, []); // No need to re-run this effect when isLoggedIn changes

  const handleAddToPlaylist = (playlistType) => {
    if (playlistType === "private") {
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }
      addToPrivatePlaylist(movieDetails);
      navigate("/private-playlist");
    } else if (playlistType === "public") {
      addToPublicPlaylist(movieDetails);
      const publicPlaylist = JSON.parse(localStorage.getItem("publicPlaylist")) || [];
      publicPlaylist.push(movieDetails.Title);
      localStorage.setItem("publicPlaylist", JSON.stringify(publicPlaylist));
      // navigate("/public-playlist");
      toast.success("Movie added successfully")
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-details-container">
      <img src={movieDetails.Poster} alt={movieDetails.Title} />
      <div className="movie-details-content">
        <h1>{movieDetails.Title}</h1>
        <p>{movieDetails.Plot}</p>
        <p>Released: {movieDetails.Released}</p>
        <p>Genre: {movieDetails.Genre}</p>
        <div>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => handleAddToPlaylist("private")}
          >
            Add to Private Playlist
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => handleAddToPlaylist("public")}
          >
            Add to Public Playlist
          </button>
        </div>
        <Link to="/search" type="button" className="btn btn-dark back-but">
          Back
        </Link>
      </div>
      {/* <ToastContainer/> */}
    </div>
  );
};

export default MovieDetails;
