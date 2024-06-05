import React, { useContext, useEffect, useState } from "react";
import { PlaylistContext } from "../contexts/PlaylistContext";
import { fetchALLPlaylist, fetchPlaylist } from "../services/user-service";
import { toast } from "react-toastify";
import "./PublicPlaylist.css";

const PublicPlaylist = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const { publicPlaylist, removeFromPublicPlaylist } = useContext(PlaylistContext);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPublicPlaylist = async () => {
      try {
        let moviesData;
        if(userId){
          moviesData=await fetchPlaylist(userId, "public");
        }else{
          moviesData=await fetchALLPlaylist("public");
        }
        console.log("Movies data:", moviesData);
        setMovies(moviesData);
      } catch (error) {
        setError(error.message);
      }
    };
      
    fetchPublicPlaylist();
  }, [publicPlaylist, userId]);

  const deleteMovieFromPlaylist = async (movie) => {
    try {
      await removeFromPublicPlaylist(movie.imdbID);
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
             {userId ? <div className="public-movie-actions">
                <button onClick={() => deleteMovieFromPlaylist(movie)}>Delete</button>
              </div> :''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicPlaylist;
