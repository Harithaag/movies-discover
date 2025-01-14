import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import Header from './components/Header';
import Movies from './components/Movies';
import TvShows from './components/TvShows';
import {store} from './store/store';
import MovieDetails from 'components/MovieDetails';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <div style={{ marginTop: '64px' }}> 
          <Routes>
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tvshows" element={<TvShows />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
