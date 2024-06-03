// PublicPlaylist.js
import React, { useContext, useEffect, useState } from "react";
import { deleteMovieService, publicDisplay } from "../services/user-service";
import "./PublicPlaylist.css";
import { PlaylistContext } from "../contexts/PlaylistContext";
import { toast } from "react-toastify";

const PublicPlaylist = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const { publicPlaylist } = useContext(PlaylistContext);

  useEffect(() => {
    const fetchPublicPlaylist = async () => {
      try {
        const data = await publicDisplay();
        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }
        setMovies(data); // Set the fetched movies to state
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPublicPlaylist();
  }, [publicPlaylist]);

  const deleteMovieFromPlaylist = async (movie) => {
    try {
      const response = await deleteMovieService(movie.imdbID);
      if (response === "Movie deleted successfully") {
        toast.success("Movie deleted from playlist!");
        // Update movies state to remove the deleted movie
        setMovies(movies.filter((m) => m.imdbID !== movie.imdbID));
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
    <div className="public-playlist-container">
      <h1>Public Playlist</h1>
      <div className="public-movie-grid">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="public-movie-item">
            <img src={movie.poster} alt={movie.Title} />
            <div className="public-movie-details">
              <span className="public-movie-title">{movie.Title}</span>
              <span className="public-movie-year">({movie.Year})</span>
            </div>
            <div className="public-movie-actions">
              <button onClick={() => deleteMovieFromPlaylist(movie)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicPlaylist;
