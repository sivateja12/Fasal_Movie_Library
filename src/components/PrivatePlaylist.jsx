import React, { useContext, useEffect, useState } from "react";
import {
  privateDisplay,
  privatePlaylistService,
} from "../services/user-service";
import "./PrivatePlaylist.css"; // Import CSS file for styling
import { PlaylistContext } from "../contexts/PlaylistContext";
import { toast } from "react-toastify";

const PrivatePlaylist = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const { privatePlaylist } = useContext(PlaylistContext);

  useEffect(() => {
    const fetchPrivatePlaylist = async () => {
      const isInserted = localStorage.getItem('privatePlaylistInserted');

      if (!isInserted && privatePlaylist.length > 0) {
        try {
          await privatePlaylistService(privatePlaylist[0]);
          toast.success("Inserted Into database!!!");
          localStorage.setItem('privatePlaylistInserted', 'true'); // Mark as inserted
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

        if (movieIds.length !== data.length) {
          console.warn(
            "Some IMDb IDs were invalid and filtered out",
            data,
            movieIds
          );
        }

        const moviePromises = movieIds.map(async (id) => {
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
  }, [privatePlaylist]); // Add privatePlaylist as dependency

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="private-playlist-container">
      <h1>Private Playlist</h1>
      <div className="private-movie-grid">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="private-movie-item">
            <img src={movie.posterUrl} alt={movie.Title} />
            <div className="private-movie-details">
              <span className="private-movie-title">{movie.Title}</span>
              <span className="private-movie-year">({movie.Year})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivatePlaylist;
