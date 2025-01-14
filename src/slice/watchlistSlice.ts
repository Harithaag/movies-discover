import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { TMDB_API_KEY, TMDB_BASE_URL } from "utils/constant";

interface WatchlistState {
  watchlists: any[];
  loading: boolean;
  error: string | null;
  sessionId: string | null;
}

const initialState: WatchlistState = {
  watchlists: [],
  loading: false,
  error: null,
  sessionId: null,
};

const API_KEY = TMDB_API_KEY
const BASE_URL = TMDB_BASE_URL;
const account_id = 77777

export const fetchSessionId = createAsyncThunk(
  "watchlist/fetchSessionId",
  async (_, { rejectWithValue }) => {
    try {
      const tokenResponse = await axios.get(`${BASE_URL}/authentication/token/new?api_key=${API_KEY}`);
      const requestToken = tokenResponse.data.request_token;
      console.log(`Authorize the app: https://www.themoviedb.org/authenticate/${requestToken}`);
      alert(`Please authorize the app using this URL: https://www.themoviedb.org/authenticate/${requestToken}`);
      const sessionResponse = await axios.post(
        `${BASE_URL}/authentication/session/new?api_key=${API_KEY}`,
        { request_token: requestToken }
      );
      return sessionResponse.data.session_id;
    } catch (error: any) {
      console.error("Error fetching session_id:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const addToWatchlist = async (
  sessionId: string,
  mediaId: number,
  mediaType: string,
  watchlist: boolean
) => {
  const url = `${BASE_URL}/account/${account_id}/watchlist?api_key=${API_KEY}&session_id=${sessionId}`;
  try {
    const response = await axios.post(url, {
      media_type: mediaType,
      media_id: mediaId,
      watchlist,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw error;
  }
};

export const getWatchlist = async (sessionId: string, mediaType: string) => {
  const url = `${BASE_URL}/account/{account_id}/watchlist/${mediaType}?api_key=${API_KEY}&session_id=${sessionId}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    throw error;
  }
};

export const fetchWatchlist = createAsyncThunk(
  "watchlist/fetchWatchlist",
  async ({ sessionId, mediaType }: { sessionId: string; mediaType: string }, { rejectWithValue }) => {
    try {
      return await getWatchlist(sessionId, mediaType);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleWatchlistItem = createAsyncThunk(
  "watchlist/toggleWatchlistItem",
  async (
    { sessionId, mediaId, mediaType, watchlist }: { sessionId: string; mediaId: number; mediaType: string; watchlist: boolean },
    { rejectWithValue }
  ) => {
    try {
      return await addToWatchlist(sessionId, mediaId, mediaType, watchlist);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionId.fulfilled, (state, action) => {
        state.sessionId = action.payload;
      })
      .addCase(fetchSessionId.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.watchlists = action.payload;
        state.loading = false;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleWatchlistItem.fulfilled, (state) => {
      });
  },
});

export default watchlistSlice.reducer;
