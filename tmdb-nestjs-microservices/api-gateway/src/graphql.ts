
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Genre {
    id: number;
    name: string;
}

export interface Movie {
    id: string;
    name: string;
    overview: string;
    popularity: number;
    voteAverage: number;
    voteCount: number;
    releaseDate: string;
    genres: Nullable<Genre>[];
}

export interface IQuery {
    findMovie(id: string): Nullable<Movie> | Promise<Nullable<Movie>>;
}

type Nullable<T> = T | null;
