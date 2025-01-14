import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Card,
  CardMedia,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";
import axios from "axios";
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_URL } from "utils/constant";
import { CastIF, CrewIF, MovieDetailsIF, ReviewIF, SimilarMovieIF } from "models/Movie";
import { ThemeContext } from "context/ThemeContext";
import CommonTypography from "./common/CommonTypography";

const MovieDetails: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsIF | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cast, setCast] = useState<CastIF[]>([]);
  const [crew, setCrew] = useState<CrewIF[]>([]);
  const [reviews, setReviews] = useState<ReviewIF[]>([]);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovieIF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [castError, setCastError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [similarMoviesError, setSimilarMoviesError] = useState<string | null>(null);
  const [trailerLoading, setTrailerLoading] = useState(true);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      setCastError(null);
      setReviewsError(null);
      setSimilarMoviesError(null);
      const movieDetailsUrl = `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`;
      const movieTrailerUrl = `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`;
      const movieCreditsUrl = `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`;
      const movieReviewsUrl = `${TMDB_BASE_URL}/movie/${id}/reviews?api_key=${TMDB_API_KEY}`;
      const movieSimilarUrl = `${TMDB_BASE_URL}/movie/${id}/similar?api_key=${TMDB_API_KEY}`;
      try {
        const results = await Promise.allSettled([
          axios.get(movieDetailsUrl),
          axios.get(movieTrailerUrl),
          axios.get(movieCreditsUrl),
          axios.get(movieReviewsUrl),
          axios.get(movieSimilarUrl),
        ]);
        const movieResponse = results[0];
        if (movieResponse.status === "fulfilled") {
          setMovie(movieResponse.value.data);
        } else {
          setError("Failed to load movie details. Please try again later.");
        }

        const trailerResponse = results[1];
        if (trailerResponse.status === "fulfilled") {
          const trailer = trailerResponse.value.data.results.find(
            (video: { type: string; site: string }) =>
              video.type === "Trailer" && video.site === "YouTube"
          );
          setTrailerKey(trailer?.key || null);
          setTrailerLoading(false);
        }

        const creditsResponse = results[2];
        if (creditsResponse.status === "fulfilled") {
          setCast(creditsResponse.value.data.cast.slice(0, 10));
          setCrew(
            creditsResponse.value.data.crew.filter(
              (member: CrewIF) => member.job === "Director"
            )
          );
        } else {
          setCastError("Cast and crew data not found.");
        }

        const reviewsResponse = results[3];
        if (reviewsResponse.status === "fulfilled") {
          setReviews(reviewsResponse.value.data.results);
        } else {
          setReviewsError("No reviews available for this movie.");
        }

        const similarResponse = results[4];
        if (similarResponse.status === "fulfilled") {
          setSimilarMovies(similarResponse.value.data.results);
        } else {
          setSimilarMoviesError("No similar movies found.");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CommonTypography variant="h5" color="error">
          {error}
        </CommonTypography>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CommonTypography variant="h5">Movie not found</CommonTypography>
      </Box>
    );
  }

  return (
    <Box padding={4}
      sx={{
        backgroundColor: theme === "dark" ? "black" : "white",
        minHeight: "100vh",
      }}>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        <CardMedia
          component="img"
          sx={{
            width: { xs: "100%", md: 500 },
            height: "auto",
            borderRadius: 2,
            alignSelf: "flex-start",
          }}
          image={`${TMDB_IMAGE_URL}${movie.poster_path}`}
          alt={movie.title}
          loading="lazy"
        />
        <Box flex={1}>
          <Box marginBottom={2}>
            <CommonTypography variant="h4" gutterBottom>
              {movie.title}
            </CommonTypography>
            <CommonTypography variant="body1" gutterBottom>
              Release Date: {new Date(movie.release_date).toLocaleDateString()}
            </CommonTypography>
            <CommonTypography variant="body1" gutterBottom>
              Rating: {movie.vote_average}
            </CommonTypography>
            <CommonTypography variant="body2">{movie.overview}</CommonTypography>
          </Box>
          {trailerLoading && (
            <Box>
              <CircularProgress />
            </Box>
          )}
          {!trailerKey && !trailerLoading && (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
              <CommonTypography variant="h5">Trailer not found</CommonTypography>
            </Box>
          )}
          {trailerKey && !trailerLoading && (
            <Box>
              <CommonTypography variant="h6" gutterBottom>
                Watch Trailer
              </CommonTypography>
              <Box
                sx={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: 2,
                }}
              >
                <Box
                  component="iframe"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box marginTop={4} sx={{
        backgroundColor: theme === "dark" ? "black" : "white",
        borrder: "darkGrey"
      }}>
        <CommonTypography variant="h5">Cast</CommonTypography>
        {castError ? (
          <CommonTypography color="error">{castError}</CommonTypography>
        ) : (
          <Grid container spacing={2}>
            {cast.map((member) => (
              <Grid item key={member.id}>
                <Avatar src={`${TMDB_IMAGE_URL}${member.profile_path}`} alt={member.name} />
                <CommonTypography>{member.name}</CommonTypography>
                <CommonTypography variant="caption">{member.character}</CommonTypography>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <Box marginTop={4}>
        <CommonTypography variant="h5" gutterBottom>
          Crew
        </CommonTypography>
        <Grid container spacing={2}>
          {crew.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <Card elevation={2} sx={{
                padding: 2, backgroundColor: theme === "dark" ? "darkGrey" : "white",
              }} >
                <CommonTypography variant="h6">{member.name}</CommonTypography>
                <CommonTypography variant="body2" color="text.secondary">
                  {member.job}
                </CommonTypography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box marginTop={4}>
        <CommonTypography variant="h5">Reviews</CommonTypography>
        {reviewsError ? (
          <CommonTypography color="error">{reviewsError}</CommonTypography>
        ) : reviews.length === 0 ? (
          <CommonTypography>No reviews available.</CommonTypography>
        ) : (
          reviews.map((review) => (
            <Box key={review.id}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={
                    review.author_details.avatar_path
                      ? `${TMDB_IMAGE_URL}${review.author_details.avatar_path}`
                      : undefined
                  }
                  alt={review.author}
                />
                <Box>
                  <CommonTypography variant="body1">{review.author}</CommonTypography>
                  {review.author_details.rating && (
                    <CommonTypography variant="body2" color="text.secondary">
                      Rating: {review.author_details.rating}
                    </CommonTypography>
                  )}
                </Box>
              </Box>
              <CommonTypography variant="body2" marginTop={1}>
                {review.content}
              </CommonTypography>
              <Divider sx={{ marginY: 2 }} />
            </Box>
          ))
        )}
      </Box>
      <Box marginTop={4}>
        <CommonTypography variant="h5">Similar Movies</CommonTypography>
        {similarMoviesError ? (
          <CommonTypography color="error">{similarMoviesError}</CommonTypography>
        ) : (
          <Grid container spacing={2}>
            {similarMovies.map((movie) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={movie.id}>
                <Card elevation={2} sx={{ textAlign: "center", backgroundColor: theme === "dark" ? "darkGrey" : "white", }}>
                  <CardMedia
                    component="img"
                    sx={{
                      height: 300, borderRadius: 2
                    }}
                    image={`${TMDB_IMAGE_URL}${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <CommonTypography variant="body2" noWrap>
                    {movie.title}
                  </CommonTypography>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default MovieDetails;
