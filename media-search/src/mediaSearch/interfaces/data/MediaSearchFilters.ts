export const MediaSearchFilters: Readonly<Map<string, Set<string>>> = new Map<string, Set<string>>([
    ['type', new Set(['Book', 'Movie', 'Game'])],
    ['genres', new Set(['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western', 'Other'])]
]);