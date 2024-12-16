export interface MediaSearchFilters {
    type?: ITypeFilterValues | [];
    genres?: IGenresFilterValues | [];
}

export interface GenresFilterValues {
    genres: ['Action' | 'Adventure' | 'Animation' | 'Comedy' | 'Crime' | 'Drama' | 'Fantasy' | 'Horror' | 'Mystery' | 'Romance' | 'Sci-Fi' | 'Thriller' | 'Western' | 'Other'] | [];
}

export interface TypeFilterValues {
    type: ['Book' | 'Movie' | 'Game'] | [];
}