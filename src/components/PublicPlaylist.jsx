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
        const moviesData = [];
        for (const imdbID of publicPlaylist) {
          const response = await fetch(
            `https://www.omdbapi.com/?t=${imdbID}&apikey=6f1b1840`
          );
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

    fetchPublicPlaylist();
  }, [publicPlaylist]); // Fetch data whenever publicPlaylist changes

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
      {movies.length === 0 ? (
        <p>Please add movies to the playlist</p>
      ) : (
        <div className="public-movie-grid">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="public-movie-item">
              <img src={movie.Poster} alt={movie.Title} />
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
      )}
    </div>
  );
};

export default PublicPlaylist;
