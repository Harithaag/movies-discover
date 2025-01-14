import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { TvShowIF, TvShowsStateIF } from 'models/TvShow';
import { TMDB_API_KEY, TMDB_BASE_URL } from 'utils/constant';



const initialState: TvShowsStateIF = {
  tvShows: [],
  hasMore: true,
  loading: false,
};

const API_KEY = TMDB_API_KEY;
const BASE_URL = TMDB_BASE_URL;

export const fetchTvshows = createAsyncThunk('tvshow/fetchTvshows', async (page: number) => {
  const response = await axios.get(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
  return response.data.results;
});

const tvshowSlice = createSlice({
  name: 'popularTvShows',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTvshows.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTvshows.fulfilled, (state, action: PayloadAction<TvShowIF[]>) => {
        state.tvShows = [...state.tvShows, ...action.payload];
        state.loading = false;
        if (action.payload.length === 0) {
          state.hasMore = false;
        }
      })
      .addCase(fetchTvshows.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default tvshowSlice.reducer;
