// PrivatePlaylist.js
import React, { useContext, useEffect, useState } from "react";
import { deleteMovieService, privateDisplay } from "../services/user-service";
import "./PrivatePlaylist.css";
import { PlaylistContext } from "../contexts/PlaylistContext";
import { toast } from "react-toastify";

const PrivatePlaylist = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const { privatePlaylist } = useContext(PlaylistContext);

  useEffect(() => {
    const fetchPrivatePlaylist = async () => {
      try {
        const data = await privateDisplay();
        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }
        setMovies(data); // Set the fetched movies to state
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
    <div className="private-playlist-container">
      <h1>Private Playlist</h1>
      <div className="private-movie-grid">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="private-movie-item">
            <img src={movie.poster} alt={movie.title} />
            <div className="private-movie-details">
              <span className="private-movie-title">{movie.title}</span>
              <span
                className="
private-movie-year"
              >
                ({movie.year})
              </span>
            </div>
            <div className="private-movie-actions">
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

export default PrivatePlaylist;
