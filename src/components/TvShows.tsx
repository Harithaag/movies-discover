import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchTvshows } from '../slice/tvshowSlice';
import MovieCard from './MovieCard';
import { TvShowIF } from 'models/TvShow';
import { Box, CircularProgress, Grid } from '@mui/material';
import { ThemeContext } from 'context/ThemeContext';

const TvShows: React.FC = () => {
    const { theme } = useContext(ThemeContext);
    const dispatch: any = useDispatch();
    const { tvShows, hasMore, loading } = useSelector((state: RootState) => state.tvShows);
    const [page, setPage] = useState(1);
    const [watchlist, setWatchlist] = useState<number[]>([]);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 10 &&
            hasMore &&
            !loading
        ) {
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        dispatch(fetchTvshows(page));
    }, [dispatch, page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading]);

    const toggleWatchlist = (movieId: number) => {
        setWatchlist((prev) =>
            prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
        );
    };

    return (
        <div>
            <div className="movies-grid">
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{
                        flexGrow: 1, backgroundColor: theme === "dark" ? "black" : "white",
                        minHeight: "100vh",
                    }}>
                        <Grid container spacing={2}>
                            {tvShows.map((tvShow: TvShowIF) => (
                                <Grid
                                    key={tvShow.id}
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={2.4}
                                >
                                    <MovieCard
                                        id={tvShow.id}
                                        title={tvShow.name}
                                        poster_path={tvShow.poster_path}
                                        release_date={tvShow.release_date}
                                        vote_average={tvShow.vote_average}
                                        media_type={"tv"}
                                        isInWatchlist={watchlist.includes(tvShow.id)}
                                        onToggleWatchlist={() => toggleWatchlist(tvShow.id)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </div>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default TvShows;
