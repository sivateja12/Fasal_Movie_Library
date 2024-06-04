  import React, { createContext, useEffect, useState } from 'react';

  export const PlaylistContext = createContext();

  export const PlaylistProvider = ({ children }) => {
    const [privatePlaylist, setPrivatePlaylist] = useState([]);
    const [publicPlaylist, setPublicPlaylist] = useState([]);

    useEffect(() => {
      const storedPrivatePlaylist = JSON.parse(localStorage.getItem('privatePlaylist')) || [];
      setPrivatePlaylist(storedPrivatePlaylist);
      
      const storedPublicPlaylist = JSON.parse(localStorage.getItem('publicPlaylist')) || [];
      setPublicPlaylist(storedPublicPlaylist);
    }, []);

    const addToPrivatePlaylist = (movie) => {
      const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
      if (!isLoggedIn) {
        // If not logged in, redirect to login page
        window.location.href = '/login';
        return;
      }

      // Check if the movie title is already in the playlist
      if (privatePlaylist.some(item => item === movie.Title)) {
        // If movie already in playlist, don't add again
        return;
      }

      // Update the state using the callback form of setState
      setPrivatePlaylist((prevPlaylist) => {
        const updatedPlaylist = [...prevPlaylist, movie.Title];
        // Update local storage using the updated state
        localStorage.setItem('privatePlaylist', JSON.stringify(updatedPlaylist));
        return updatedPlaylist;
      });
    };

    const addToPublicPlaylist = (movie) => {
      // Check if the movie title is already in the playlist
      if (publicPlaylist.some(item => item === movie.Title)) {
        // If movie already in playlist, don't add again
        return;
      }

      // Update the state using the callback form of setState
      setPublicPlaylist((prevPlaylist) => {
        const updatedPlaylist = [...prevPlaylist, movie.Title];
        // Update local storage using the updated state
        localStorage.setItem('publicPlaylist', JSON.stringify(updatedPlaylist));
        return updatedPlaylist;
      });
    };

    return (
      <PlaylistContext.Provider
        value={{ privatePlaylist, publicPlaylist, addToPrivatePlaylist, addToPublicPlaylist }}
      >
        {children}
      </PlaylistContext.Provider>
    );
  };
