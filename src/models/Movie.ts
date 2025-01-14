export interface MovieIF {
    id: number;
    title: string;
    poster_path: string;
    release_date?: string;
    vote_average: number;
    media_type: string
}


export interface MoviesStateIF {
    movies: MovieIF[]
    hasMore: boolean;
    loading: boolean;
}


export interface MovieDetailsIF {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
}

export interface CastIF {
    id: number;
    name: string;
    character: string;
    profile_path: string;
}

export interface CrewIF {
    id: number;
    name: string;
    job: string;
    profile_path: string;
}

export interface ReviewIF {
    id: string;
    author: string;
    content: string;
    author_details: { avatar_path: string; rating: number | null };
}

export interface SimilarMovieIF {
    id: number;
    title: string;
    poster_path: string;
}