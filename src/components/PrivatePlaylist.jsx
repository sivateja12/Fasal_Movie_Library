import React, { useContext, useEffect, useState } from "react";
import {
  deleteMovieService,
  privateDisplay,
  privatePlaylistService
} from "../services/user-service";
import "./PrivatePlaylist.css"; // Import CSS file for styling
import { PlaylistContext } from "../contexts/PlaylistContext";
import { toast } from "react-toastify";

const PrivatePlaylist = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isInserted, setIsInserted] = useState(false); // State to track insertion
  const { privatePlaylist } = useContext(PlaylistContext);

  useEffect(() => {
    const fetchPrivatePlaylist = async () => {
      if (!isInserted && privatePlaylist.length > 0) {
        try {
          const response = await privatePlaylistService(privatePlaylist[0]);
          if (response === "Private playlist stored successfully") {
            toast.success("Inserted into database!!!");
          } else if (response === "Playlist with this IMDb ID already exists") {
            toast.info("This playlist is already in the database.");
          }
          setIsInserted(true); // Mark as inserted
        } catch (error) {
          console.log(error);
        }
      }

      try {
        const data = await privateDisplay();

        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        const movieIds = data.map((movie) => movie.imdbID);

        // Validate IMDb IDs
        const validMovieIds = movieIds.filter((id) => /^tt\d{7,8}$/.test(id));

        if (validMovieIds.length !== movieIds.length) {
          console.warn(
            "Some IMDb IDs were invalid and filtered out",
            movieIds,
            validMovieIds
          );
        }

        const moviePromises = validMovieIds.map(async (id) => {
          try {
            const movieResponse = await fetch(
              `https://www.omdbapi.com/?i=${id}&apikey=6f1b1840`
            );
            const movieData = await movieResponse.json();

            if (movieData.Response === "False") {
              throw new Error(movieData.Error);
            }

            // Include poster URL in movie data
            movieData.posterUrl = movieData.Poster;

            return movieData;
          } catch (error) {
            console.error(`OMDB API error for IMDb ID ${id}:`, error.message);
            return null;
          }
        });

        const moviesData = await Promise.all(moviePromises);

        setMovies(moviesData.filter((movie) => movie !== null));
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPrivatePlaylist();
  }, [isInserted, privatePlaylist]); // Add isInserted and privatePlaylist as dependencies

  const addMovieToPrivatePlaylist = async (movie) => {
    try {
      const response = await privatePlaylistService({
        imdbID: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        poster: movie.posterUrl
      });

      if (response === "Private playlist stored successfully") {
        toast.success("Movie added to private playlist!");
      } else if (response === "Playlist with this IMDb ID already exists") {
        toast.info("This movie is already in the private playlist.");
      }
    } catch (error) {
      console.error("Error adding movie to private playlist:", error);
      toast.error("Failed to add movie to private playlist.");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  const deleteMovieFromPlaylist = async (movie) => {
    try {
      const response = await deleteMovieService(movie.imdbID);
      if (response === "Movie deleted successfully") {
        toast.success("Movie deleted from playlist!");
        // Update movies state to remove the deleted movie
        setMovies(movies.filter(m => m.imdbID !== movie.imdbID));
      } else {
        toast.error("Failed to delete movie from playlist.");
      }
    } catch (error) {
      console.error("Error deleting movie from playlist:", error);
      toast.error("Failed to delete movie from playlist.");
    }
  };
  

  return (
    <div className="private-playlist-container">
      <h1>Private Playlist</h1>
      <div className="private-movie-grid">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="private-movie-item">
            <img
              src={movie.posterUrl}
              alt={movie.Title}
              onClick={() => addMovieToPrivatePlaylist(movie)}
            />
            <div className="private-movie-details">
              <span className="private-movie-title">{movie.Title}</span>
              <span className="private-movie-year">({movie.Year})</span>
            </div>
            <div className="public-movie-actions">
              <button onClick={() => deleteMovieFromPlaylist(movie)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivatePlaylist;
