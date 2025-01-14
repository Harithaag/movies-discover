export interface TvShowIF {
    id: number;
    name: string;
    poster_path: string;
    release_date?: string;
    vote_average: number;
    media_type: string
}


export interface TvShowsStateIF {
    tvShows: TvShowIF[]
    hasMore: boolean;
    loading: boolean;
}
