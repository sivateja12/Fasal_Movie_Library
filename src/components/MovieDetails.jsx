// MovieDetails.js
import { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";
import Loader from "./Loader";
import { PlaylistContext } from "../contexts/PlaylistContext";

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
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // No need to re-run this effect when isLoggedIn changes

  const handleAddToPlaylist = (playlistType) => {
    if (playlistType === "private") {
      if (isLoggedIn) {
        addToPrivatePlaylist(movieDetails);
        navigate("/private-playlist");
      } else {
        navigate("/login");
      }
    } else {
      addToPublicPlaylist(movieDetails);
      navigate("/public-playlist");
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
          <button type="button" className="btn btn-success" onClick={() => handleAddToPlaylist("private")}>
            Add to Private Playlist
          </button>
          <button type="button" className="btn btn-warning"  onClick={() => handleAddToPlaylist("public")}>
            Add to Public Playlist
          </button>
        </div>
        <Link to="/search" type="button" className="btn btn-dark back-but">
          Back
        </Link>
      </div>
    </div>
  );
};

export default MovieDetails;