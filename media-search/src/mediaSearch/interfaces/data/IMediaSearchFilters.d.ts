export interface IMediaSearchFilters {
    type: 'Book' | 'Movie' | 'Game'[];
    genres: 'Action' | 'Adventure' | 'Animation' | 'Comedy' | 'Crime' | 'Drama' | 'Fantasy' | 'Horror' | 'Mystery' | 'Romance' | 'Sci-Fi' | 'Thriller' | 'Western' | 'Other';
}