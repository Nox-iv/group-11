export interface IMediaSearchFilters {
    type: ITypeFilterValues | [];
    genres: IGenresFilterValues | [];
}

export interface IGenresFilterValues {
    genres: ['Action' | 'Adventure' | 'Animation' | 'Comedy' | 'Crime' | 'Drama' | 'Fantasy' | 'Horror' | 'Mystery' | 'Romance' | 'Sci-Fi' | 'Thriller' | 'Western' | 'Other'] | [];
}

export interface ITypeFilterValues {
    type: ['Book' | 'Movie' | 'Game'] | [];
}