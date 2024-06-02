import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MovieSearch.css";

function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const searchMovies = async () => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${query}&apikey=6f1b1840`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      if (data.Search) {
        setMovies(data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim() !== "") {
      searchMovies();
    }
  };

  const handleMovieClick = (imdbID) => {
    navigate(`/movie/${imdbID}`);
  };

  return (
    <div className="bg">
      <h2 style={{ textAlign: "center" }}>Movie Search</h2>
      <center>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for a movie..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </center>
      <div className="movie-container">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="movie-item"
            onClick={() => handleMovieClick(movie.imdbID)}
          >
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="movie-poster"
            />
            <p className="movie-title">{movie.Title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieSearch;
