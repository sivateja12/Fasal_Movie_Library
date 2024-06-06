import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";
import Loader from "./Loader";
import { PlaylistContext } from "../contexts/PlaylistContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MovieDetails = () => {
  const { imdbID } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToPrivatePlaylist, addToPublicPlaylist } = useContext(PlaylistContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userId= localStorage.getItem('userId')

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
  }, []);

  const handleAddToPlaylist = async (playlistType) => {
    try {
      if (playlistType === "private" && userId===null) {
        localStorage.setItem("redirectAfterLogin", `/movie/${imdbID}`);
        navigate("/login");
        return;
      }

      const movie = {
        Title: movieDetails.Title,
        Year: movieDetails.Year,
        Poster: movieDetails.Poster,
        imdbID: imdbID,
      };

      if (playlistType === "private") {
        await addToPrivatePlaylist(movie);
        toast.success("Movie added to private playlist!");
      } else if (playlistType === "public") {
        await addToPublicPlaylist(movie);
        toast.success("Movie added to public playlist!");
      }
    } catch (error) {
      console.error("Error adding movie to playlist:", error);
      toast.error(`Failed to add movie to playlist: ${error.message}`);
    }
  };

  if (loading) {
    return <Loader />;
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
      <ToastContainer />
    </div>
  );
};

export default MovieDetails;
