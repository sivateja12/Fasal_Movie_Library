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

export const privatePlaylistService = (movie) => {
  return myAxios.post("/private-playlist", movie).then((res) => res.data);
};

export const publicDisplay = () => {
  return myAxios.get('/public-playlist').then((res) => res.data);
};

export const privateDisplay = () => {
  return myAxios.get('/private-playlist').then((res) => res.data);
};
