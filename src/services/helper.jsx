import axios from "axios";

export const BASE_URL = "https://15.207.248.1";

export const myAxios = axios.create({
  baseURL: BASE_URL,
});
