import React, { useContext, useEffect, useState } from 'react';
import { publicDisplay, publicPlaylistService } from '../services/user-service';
import './PublicPlaylist.css'; // Import CSS file for styling
import { PlaylistContext } from '../contexts/PlaylistContext';
import { toast } from 'react-toastify';

const PublicPlaylist = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isInserted, setIsInserted] = useState(false); // State to track insertion
  const { publicPlaylist } = useContext(PlaylistContext);

  useEffect(() => {
    const fetchPublicPlaylist = async () => {
      if (!isInserted ) {
        try {
          await publicPlaylistService(publicPlaylist[0]);
          toast.success("Inserted Into database!!!");
          setIsInserted(true); // Mark as inserted
        } catch (error) {
          console.log(error);
        }
      }

      try {
        const data = await publicDisplay();

        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }

        const movieIds = data.map(movie => movie.imdbID);

        // Validate IMDb IDs
        const validMovieIds = movieIds.filter(id => /^tt\d{7,8}$/.test(id));

        if (validMovieIds.length !== movieIds.length) {
          console.warn("Some IMDb IDs were invalid and filtered out", movieIds, validMovieIds);
        }

        const moviePromises = validMovieIds.map(async id => {
          try {
            const movieResponse = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=6f1b1840`);
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

        setMovies(moviesData.filter(movie => movie !== null));
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPublicPlaylist();
  }, [isInserted, publicPlaylist]); // Add isInserted and publicPlaylist as dependencies

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="public-playlist-container">
      <h1>Public Playlist</h1>
      <div className="public-movie-grid">
        {movies.map(movie => (
          <div key={movie.imdbID} className="public-movie-item">
            <img src={movie.posterUrl} alt={movie.Title} />
            <div className="public-movie-details">
              <span className="public-movie-title">{movie.Title}</span>
              <span className="public-movie-year">({movie.Year})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicPlaylist;
