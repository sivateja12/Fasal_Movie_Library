import React, { useContext, useEffect, useState } from "react";
import { PlaylistContext } from "../contexts/PlaylistContext";
import { fetchPlaylist } from "../services/user-service";
import { toast } from "react-toastify";
import "./PrivatePlaylist.css";

const PrivatePlaylist = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const { privatePlaylist, removeFromPrivatePlaylist } = useContext(PlaylistContext);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPrivatePlaylist = async () => {
      try {
        const moviesData = await fetchPlaylist(userId, "private");
        console.log("Movies data:", moviesData);
        setMovies(moviesData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPrivatePlaylist();
  }, [privatePlaylist, userId]);

  const deleteMovieFromPlaylist = async (movie) => {
    try {
      await removeFromPrivatePlaylist(movie.imdbID);
      toast.success("Movie deleted from playlist!");
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
      {movies.length === 0 ? (
        <p>Please add movies to the playlist</p>
      ) : (
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
      )}
    </div>
  );
};

export default PrivatePlaylist;
