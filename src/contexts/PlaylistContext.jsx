import React, { createContext, useState } from "react";
import axios from "axios";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [privatePlaylist, setPrivatePlaylist] = useState([]);
  const [publicPlaylist, setPublicPlaylist] = useState([]);
  const userId=localStorage.getItem("userId")


  const addToPrivatePlaylist = async (movie) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !userId) {
      throw new Error("User ID is missing or invalid. Please log in again.");
    }

    try {
      const payload = {
        userId: userId,
        type: "private",
        movie: {
          imdbID: movie.imdbID,
        },
      };

      const response = await axios.post(
        "https://movie-library-backend-bnl2.onrender.com/playlists/add",
        payload
      );
      if (response.status === 200) {
        setPrivatePlaylist([...privatePlaylist, movie.imdbID]);
      } else {
        throw new Error("Failed to add movie to private playlist");
      }
    } catch (error) {
      console.error(
        "Error adding movie to private playlist:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const addToPublicPlaylist = async (movie) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !userId) {
      throw new Error("User ID is missing or invalid. Please log in again.");
    }

    try {
      const payload = {
        userId: userId,
        type: "public",
        movie: {
          imdbID: movie.imdbID,
        },
      };

      const response = await axios.post(
        "https://movie-library-backend-bnl2.onrender.com/playlists/add",
        payload
      );
      if (response.status === 200) {
        setPublicPlaylist([...publicPlaylist, movie.imdbID]);
      } else {
        throw new Error("Failed to add movie to public playlist");
      }
    } catch (error) {
      console.error(
        "Error adding movie to public playlist:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const removeFromPrivatePlaylist = async (imdbID) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !userId) {
      throw new Error("User ID is missing or invalid. Please log in again.");
    }

    try {
      const payload = {
        userId: userId,
        type: "private",
        movie: {
          imdbID,
        },
      };

      const response = await axios.post(
        "https://movie-library-backend-bnl2.onrender.com/playlists/delete",
        payload
      );
      if (response.status === 200) {
        setPrivatePlaylist(privatePlaylist.filter((id) => id !== imdbID));
      } else {
        throw new Error("Failed to remove movie from private playlist");
      }
    } catch (error) {
      console.error(
        "Error removing movie from private playlist:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const removeFromPublicPlaylist = async (imdbID) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !userId) {
      throw new Error("User ID is missing or invalid. Please log in again.");
    }

    try {
      const payload = {
        userId: userId,
        type: "public",
        movie: {
          imdbID,
        },
      };

      const response = await axios.post(
        "https://movie-library-backend-bnl2.onrender.com/playlists/delete",
        payload
      );
      if (response.status === 200) {
        setPublicPlaylist(publicPlaylist.filter((id) => id !== imdbID));
      } else {
        throw new Error("Failed to remove movie from public playlist");
      }
    } catch (error) {
      console.error(
        "Error removing movie from public playlist:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  return (
    <PlaylistContext.Provider
      value={{
        addToPrivatePlaylist,
        addToPublicPlaylist,
        removeFromPrivatePlaylist,
        removeFromPublicPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
