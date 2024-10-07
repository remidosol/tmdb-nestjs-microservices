/************************************************************************************/
/************************************************************************************/

export type SortBy =
  | "primary_release_date.asc"
  | "primary_release_date.desc"
  | "original_title.asc"
  | "original_title.desc"
  | "popularity.desc"
  | "popularity.asc"
  | "revenue.desc"
  | "revenue.asc"
  | "title.desc"
  | "title.asc"
  | "vote_average.desc"
  | "vote_average.asc"
  | "vote_count.desc"
  | "vote_count.asc"
  | "vote_count.gte";

export type TmdbDiscoverMovieRequest = {
  page?: number;
  sortBy?: SortBy;
  watch_region?: string;
  with_watch_providers?: string;
  "vote_count.gte"?: string;
  "vote_average.gte"?: string;
};

/************************************************************************************/
/************************************************************************************/
