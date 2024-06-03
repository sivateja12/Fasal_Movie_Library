import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { PlaylistProvider } from "./contexts/PlaylistContext";

ReactDOM.createRoot(document.getElementById("root")).render(
 
    <PlaylistProvider>
      <App />
    </PlaylistProvider>
);
