/************************************************************************************/
/************************************************************************************/

import { BelongsToCollection, Genre, ProductionCompany, ProductionCountry, SpokenLanguage } from "./tmdb-common.types";

export type DiscoverMovieResult = {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  id: number;
  original_language?: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
};

export type TmdbDiscoverMovieResponse = {
  page: number;
  results: DiscoverMovieResult[];
  total_pages: number;
  total_results: number;
};

/************************************************************************************/
/************************************************************************************/

export type TmdbMovieDetailResponse = {
  adult?: boolean;
  backdrop_path?: string;
  belongs_to_collection?: BelongsToCollection;
  budget?: number;
  genres: Genre[];
  homepage?: string;
  id: number;
  imdb_id?: string;
  origin_country?: string[];
  original_language?: string;
  original_title?: string;
  overview: string;
  popularity: number;
  poster_path?: string;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  release_date: string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: SpokenLanguage[];
  status?: string;
  tagline?: string;
  title: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
};
/************************************************************************************/
/************************************************************************************/
