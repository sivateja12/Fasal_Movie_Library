// src/components/PublicPlaylist.js
import { useContext } from 'react';
import { PlaylistContext } from '../contexts/PlaylistContext';
import './Playlist.css';  // Add this import to include the styles

const PublicPlaylist = () => {
  const { publicPlaylist } = useContext(PlaylistContext);

  return (
    <div className="playlist-container">
      <h2>Public Playlist</h2>
      <div className="playlist-grid">
        {publicPlaylist.map((movie) => (
          <div key={movie.imdbID} className="playlist-item">
            <img src={movie.Poster} alt={movie.Title} className="playlist-item-img" />
            <p>{movie.Title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicPlaylist;
