import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../slice/movieSlice';
import tvshowsReducer from '../slice/tvshowSlice';
import watchlistSlice from '../slice/watchlistSlice'

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    tvShows: tvshowsReducer,
    watchlists: watchlistSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
