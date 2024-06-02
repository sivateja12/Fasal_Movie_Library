// src/contexts/PlaylistContext.js
import { createContext, useState } from 'react';

export const PlaylistContext = createContext();

// eslint-disable-next-line react/prop-types
export const PlaylistProvider = ({ children }) => {
  const [privatePlaylist, setPrivatePlaylist] = useState([]);
  const [publicPlaylist, setPublicPlaylist] = useState([]);

  const addToPrivatePlaylist = (movie) => {
    setPrivatePlaylist((prev) => [...prev, movie]);
  };

  const addToPublicPlaylist = (movie) => {
    setPublicPlaylist((prev) => [...prev, movie]);
  };

  return (
    <PlaylistContext.Provider
      value={{ privatePlaylist, publicPlaylist, addToPrivatePlaylist, addToPublicPlaylist }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
