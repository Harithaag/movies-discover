import React, { useEffect, useState, useCallback, useMemo, useContext } from "react";
import {
  CircularProgress,
  Box,
  TextField,
  Grid,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import MovieCard from "./MovieCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { fetchMovies, resetMovies } from "slice/movieSlice";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "context/ThemeContext";
import CommonTypography from "./common/CommonTypography";
import { TMDB_API_KEY } from "utils/constant";

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const Movies: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const dispatch: any = useDispatch();
  const { movies, hasMore, loading } = useSelector((state: RootState) => state.movies);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDebounced, setSearchQueryDebounced] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 10]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const years = useMemo(
    () => Array.from(new Array(50), (_, index) => (new Date().getFullYear() - index).toString()),
    []
  );

  useEffect(() => {
    setPage(1);
    dispatch(resetMovies());
  }, [location.pathname, dispatch]);


  useEffect(() => {
    const fetchMovieData = () => {
      dispatch(
        fetchMovies({
          page,
          searchQuery: searchQuery.trim(),
          selectedGenre,
          selectedYear,
          ratingRange,
        })
      );
    };
    fetchMovieData();
  }, [dispatch, page, searchQuery, selectedGenre, selectedYear, ratingRange]);

  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setSearchQueryDebounced(value);
      setPage(1);
    }, 300),
    []
  );

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    handleSearchChange(value);
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 10 &&
      hasMore &&
      !loading
    ) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchQueryDebounced("");
    setPage(1);
    setSelectedGenre(null);
    setSelectedYear("");
    setRatingRange([0, 10]);
    dispatch(resetMovies());
    dispatch(fetchMovies({ page: 1 }));
  }, [dispatch]);

  const toggleWatchlist = (movieId: number) => {
    setWatchlist((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );
  };

  return (
    <Box padding={2}
      sx={{
        backgroundColor: theme === "dark" ? "black" : "white",
        minHeight: "100vh",
      }}>
      <Grid container spacing={2} alignItems="center" marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth sx={{ color: theme === "dark" ? "white" : "black" }}>
            <InputLabel
              sx={{
                color: theme === "dark" ? "white" : "black",
                borderColor: theme === "dark" ? "white" : "black",
              }}
            >
              Genre
            </InputLabel>
            <Select
              value={selectedGenre || ""}
              onChange={(e) => setSelectedGenre(e.target.value)}
              displayEmpty
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme === "dark" ? "darkgray" : "lightgray",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme === "dark" ? "white" : "black",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme === "dark" ? "white" : "black",
                },
                color: theme === "dark" ? "white" : "black"
              }}
            >
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: theme === "dark" ? "white" : "black" }}>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Year"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme === "dark" ? "darkgray" : "lightgray",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme === "dark" ? "white" : "black",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme === "dark" ? "white" : "black",
                },
                color: theme === "dark" ? "white" : "black"
              }}
            >
              <MenuItem value="">Any</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <CommonTypography gutterBottom>Rating Range</CommonTypography>
            <Slider
              value={ratingRange}
              onChange={(e, newValue) => setRatingRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" alignItems="center">
            <TextField
              label="Search Movies"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              fullWidth
              InputProps={{
                placeholder: "Type to search...",
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 10,
                  "& fieldset": {
                    borderColor: theme === "dark" ? "darkgray" : "lightgray",
                  },
                  "&:hover fieldset": {
                    borderColor: theme === "dark" ? "white" : "black",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme === "dark" ? "white" : "black",
                  },
                  "& input": {
                    color: theme === "dark" ? "white" : "black",
                    "&::placeholder": {
                      color: theme === "dark" ? "gray" : "darkgray"
                    },
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme === "dark" ? "white" : "black"
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: theme === "dark" ? "white" : "black"
                },
              }}
            />

            <IconButton sx={{
              color: theme === "dark" ? "white" : "black",
              borderColor: "darkGrey"
            }} onClick={handleClearSearch}>
              <ClearIcon />
            </IconButton>

          </Box>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {movies.map((movie) => (
            <Grid key={movie.id} item xs={12} sm={6} md={4} lg={2.4}>
              <MovieCard
                id={movie.id}
                title={movie.title}
                poster_path={movie.poster_path}
                release_date={movie.release_date}
                vote_average={movie.vote_average}
                media_type="movie"
                isInWatchlist={watchlist.includes(movie.id)}
                onToggleWatchlist={() => toggleWatchlist(movie.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Movies;
