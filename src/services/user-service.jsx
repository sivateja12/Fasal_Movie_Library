// import { myAxios } from "./helper";

// export const checkEmail = async (email) => {
//   return await myAxios.get("/check-email", { params: { email } });
// };

// export const signUp = (user) => {
//   return myAxios.post("/signup", user).then((response) => response.data);
// };

// export const loginUser = (user) => {
//   return myAxios.post("/login", user).then((res) => res.data);
// };

// export const publicPlaylistService = (playlist) => {
//   return myAxios.post("/public-playlist", playlist).then((res) => res.data);
// };

// export const privatePlaylistService = async (playlist) => {
// return myAxios.post("/private-playlist", playlist).then((res) => res.data);
// }

// export const publicDisplay = () => {
//   return myAxios.get("/public-display").then((res) => res.data);
// };

// export const privateDisplay = () => {
//   return myAxios.get("/private-display").then((res) => res.data);
// };

// // export const deleteMovieService = async (imdbID) => {
// //   try {
// //     const response = await myAxios.delete(`/delete-movie/${imdbID}`);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to delete movie");
// //   }
// // };
// export const deleteMovieService = async (imdbID, playlistType) => {
//   try {
//     // Fetch the current playlist from local storage
//     const playlist = JSON.parse(localStorage.getItem(playlistType)) || [];

//     // Filter out the movie to be deleted
//     const updatedPlaylist = playlist.filter(movieTitle => movieTitle !== imdbID);

//     // Update the local storage with the new playlist
//     localStorage.setItem(playlistType, JSON.stringify(updatedPlaylist));

//     return "Movie deleted successfully";
//   } catch (error) {
//     throw new Error("Failed to delete movie");
//   }
// };

//---------------------------------
import axios from "axios";

const API_BASE_URL = "https://movie-library-backend-bnl2.onrender.com";
// const userId = localStorage.getItem('userId')

export const signUp = (user) => {
  return axios
    .post(`${API_BASE_URL}/users/signup`, user)
    .then((response) =>{
      console.log(response.data)
    response.data});
      
};

export const loginUser = (user) => {
  return axios
    .post(`${API_BASE_URL}/users/login`, user)
    .then((res) => {
      res.data
      localStorage.setItem("userId",(res.data.uid))
    });
};


export const fetchPlaylist = async (userId, type) => {
  console.log(`Fetching playlist for user: ${userId}, type: ${type}`);
  try {
    const res = await axios.get(`${API_BASE_URL}/playlists/${userId}/${type}`);
    const movieIDs = res.data;

    // Fetch movie details from OMDB API
    const movieDetailsPromises = movieIDs.map(imdbID => 
      axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=6f1b1840`)
    );

    const movieDetailsResponses = await Promise.all(movieDetailsPromises);
    const movieDetails = movieDetailsResponses.map(response => response.data);

    console.log("Fetched movie details:", movieDetails);
    return movieDetails;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
};

export const fetchALLPlaylist = async (type) => {
  console.log(`Fetching playlist type: ${type}`);
  try {
    const res = await axios.get(`${API_BASE_URL}/playlists/${type}`);
    const movieIDs = res.data;

    // Fetch movie details from OMDB API
    const movieDetailsPromises = movieIDs.map(imdbID => 
      axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=6f1b1840`)
    );

    const movieDetailsResponses = await Promise.all(movieDetailsPromises);
    const movieDetails = movieDetailsResponses.map(response => response.data);

    console.log("Fetched movie details:", movieDetails);
    return movieDetails;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
};


export const addToPlaylist = async ( type, movie) => {
const userId = localStorage.getItem("userId");

  console.log(`Adding movie to playlist for user: ${userId}, type: ${type}, movie: ${movie}`);
  try {
    const res = await axios.post(`${API_BASE_URL}/playlists/add`, { userId, type, movie });
    return res.data;
  } catch (error) {
    console.error('Error adding movie to playlist:', error);
    throw error;
  }
};

export const deleteFromPlaylist = async ( type, movie) => {
const userId = localStorage.getItem("userId");

  console.log(`Deleting movie from playlist for user: ${userId}, type: ${type}, movie: ${movie}`);
  try {
    const res = await axios.post(`${API_BASE_URL}/playlists/delete`, { userId, type, movie });
    return res.data;
  } catch (error) {
    console.error('Error deleting movie from playlist:', error);
    throw error;
  }
};
