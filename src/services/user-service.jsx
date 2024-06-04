import { myAxios } from "./helper";

export const checkEmail = async (email) => {
  return await myAxios.get("/check-email", { params: { email } });
};

export const signUp = (user) => {
  return myAxios.post("/signup", user).then((response) => response.data);
};

export const loginUser = (user) => {
  return myAxios.post("/login", user).then((res) => res.data);
};

export const publicPlaylistService = (playlist) => {
  return myAxios.post("/public-playlist", playlist).then((res) => res.data);
};

export const privatePlaylistService = async (playlist) => {
return myAxios.post("/private-playlist", playlist).then((res) => res.data);
}

export const publicDisplay = () => {
  return myAxios.get("/public-display").then((res) => res.data);
};

export const privateDisplay = () => {
  return myAxios.get("/private-display").then((res) => res.data);
};

// export const deleteMovieService = async (imdbID) => {
//   try {
//     const response = await myAxios.delete(`/delete-movie/${imdbID}`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to delete movie");
//   }
// };
export const deleteMovieService = async (imdbID, playlistType) => {
  try {
    // Fetch the current playlist from local storage
    const playlist = JSON.parse(localStorage.getItem(playlistType)) || [];

    // Filter out the movie to be deleted
    const updatedPlaylist = playlist.filter(movieTitle => movieTitle !== imdbID);

    // Update the local storage with the new playlist
    localStorage.setItem(playlistType, JSON.stringify(updatedPlaylist));

    return "Movie deleted successfully";
  } catch (error) {
    throw new Error("Failed to delete movie");
  }
};
