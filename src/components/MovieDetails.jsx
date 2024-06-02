import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./MovieDetails.css";
import Loader from "./Loader";

const MovieDetails = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state


  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?i=${id}&apikey=6f1b1840`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setMovieDetails(data);
        setLoading(false); // Set loading to false when data is fetched

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // if (!movieDetails) {
  //   return <div>Loading...</div>;
  // }
  
  if (loading) {
    return <Loader />; // Render Loader component while loading
  }

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-details-container">
      <img src={movieDetails.Poster} alt={movieDetails.Title} />
      <div className="movie-details-content">
        <h1>{movieDetails.Title}</h1>
        <p>{movieDetails.Plot}</p>
        <p>Released: {movieDetails.Released}</p>
        <p>Genre: {movieDetails.Genre}</p>
        {/* Add more details as needed */}
        <Link to="/search" type="button" className="btn btn-dark back-but">Back</Link>

      </div>
    </div>
  );
};

export default MovieDetails;
