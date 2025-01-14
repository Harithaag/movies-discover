import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { MoviesStateIF } from "models/Movie";
import { TMDB_API_KEY, TMDB_BASE_URL } from "utils/constant";

const initialState: MoviesStateIF = {
  movies: [],
  hasMore: true,
  loading: false,
};

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ page, searchQuery, selectedGenre, selectedYear, ratingRange }: any) => {
    const [minRating, maxRating] = ratingRange;
    let url;
    if (searchQuery || selectedGenre || selectedYear || minRating !== 0 || maxRating !== 10) {
      url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}`;
      if (searchQuery) {
        url += `&query=${searchQuery}`;
      }
      if (selectedGenre) {
        url += `&with_genres=${selectedGenre}`;
      }
      if (selectedYear) {
        url += `&primary_release_year=${selectedYear}`;
      }
      if (minRating !== 0 || maxRating !== 10) {
        url += `&vote_average.gte=${minRating}&vote_average.lte=${maxRating}`;
      }
    } else {
      url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
    }
    const response = await axios.get(url);
    return response.data;
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    resetMovies: (state) => {
      state.movies = [];
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action: any) => {
        const { page, searchQuery, selectedGenre, selectedYear, ratingRange } = action?.meta?.arg;
        if (
          page === 1 &&
          (searchQuery || selectedGenre || selectedYear || ratingRange[0] !== 0 || ratingRange[1] !== 10)
        ) {
          state.movies = [];
        }
        state.movies = [...state.movies, ...action.payload.results];
        state.hasMore = action.payload.page < action.payload.total_pages;
        state.loading = false;
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetMovies } = moviesSlice.actions;

export default moviesSlice.reducer;
