import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";
import Loader from "./Loader";
import { PlaylistContext } from "../contexts/PlaylistContext";
import { privatePlaylistService } from "../services/user-service";
import { publicPlaylistService } from "../services/user-service";

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

  const handleAddToPlaylist = async (playlistType) => {
    if (playlistType === "private") {
      if (isLoggedIn) {
        try {
          const response = await privatePlaylistService({
            imdbID: movieDetails.imdbID,
            title: movieDetails.Title,
            year: movieDetails.Year,
            poster: movieDetails.Poster,
          });
          if (response === "Private playlist stored successfully") {
            navigate("/private-playlist");
          } else if (response === "Playlist with this IMDb ID already exists") {
            // Handle if movie already exists in playlist
          }
        } catch (error) {
          console.error("Error adding movie to private playlist:", error);
          // Handle error adding movie to private playlist
        }
      } else {
        navigate("/login");
      }
    } else if (playlistType === "public") {
      try {
        const response = await publicPlaylistService({
          imdbID: movieDetails.imdbID,
          title: movieDetails.Title,
          year: movieDetails.Year,
          poster: movieDetails.Poster,
        });
        if (response === "Public playlist stored successfully") {
          navigate("/public-playlist");
        } else if (response === "Playlist with this IMDb ID already exists") {
          // Handle if movie already exists in playlist
        }
      } catch (error) {
        console.error("Error adding movie to public playlist:", error);
        // Handle error adding movie to public playlist
      }
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
    </div>
  );
};

export default MovieDetails;
