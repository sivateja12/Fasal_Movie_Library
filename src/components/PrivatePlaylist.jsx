import React, { useContext, useEffect, useState } from "react";
import { deleteMovieService } from "../services/user-service";
import "./PrivatePlaylist.css";
import { PlaylistContext } from "../contexts/PlaylistContext";
import { toast } from "react-toastify";

const PrivatePlaylist = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const { privatePlaylist, removeFromPrivatePlaylist } = useContext(PlaylistContext);

  useEffect(() => {
    const fetchPrivatePlaylist = async () => {
      try {
        const moviesData = [];
        const uniqueMovies = new Set(privatePlaylist); // Ensure no duplicates
        for (const title of uniqueMovies) {
          const response = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=6f1b1840`);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const movie = await response.json();
          moviesData.push(movie);
        }
        setMovies(moviesData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPrivatePlaylist();
  }, [privatePlaylist]);

  const deleteMovieFromPlaylist = async (movie) => {
    try {
      const response = await deleteMovieService(movie.imdbID);
      if (response === "Movie deleted successfully") {
        toast.success("Movie deleted from playlist!");
        removeFromPrivatePlaylist(movie.Title);
      } else {
        toast.error("Failed to delete movie from playlist.");
      }
    } catch (error) {
      console.error("Error deleting movie from playlist:", error);
      toast.error("Failed to delete movie from playlist.");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="private-playlist-container">
      <h1>Private Playlist</h1>
      <div className="private-movie-grid">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="private-movie-item">
            <img src={movie.Poster} alt={movie.Title} />
            <div className="private-movie-details">
              <span className="private-movie-title">{movie.Title}</span>
              <span className="private-movie-year">({movie.Year})</span>
            </div>
            <div className="private-movie-actions">
              <button onClick={() => deleteMovieFromPlaylist(movie)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivatePlaylist;
