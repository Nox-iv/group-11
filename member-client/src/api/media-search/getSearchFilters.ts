interface SearchFilters {
    type: string[];
    genres: string[];
}

export const getSearchFilters = async (): Promise<SearchFilters> => {
    if (process.env.NODE_ENV === 'development') {
        return {
            type: ['Book', 'Movie', 'Game'],
            genres: ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western', 'Other'],
        }
    } else {
        const response = await fetch(`${import.meta.env.MEDIA_SEARCH_API_URL}/filters`);
        if (!response.ok) {
            throw new Error('Failed to fetch search filters');
        }

        return response.json();
    }
}