import { MediaSearchResult } from "../mediaSearch/data/documents/mediaSearchResult.d";

export const mediaSearchResultTestData : MediaSearchResult[] = [
    {
        mediaId: 1,
        title: "Test Media",
        type: "Movie",
        author: "Test Author",
        description: "Test Description",
        releaseDate: "2024-01-01",
        imageUrl: "https://example.com/image.jpg",
        genres: ["Action", "Adventure"],
        mediaStock: [
            {
                locationId: 1,
                locationName: "Sheffield",
                stockCount: 10
            }, 
            {
                locationId: 2,
                locationName: "Manchester",
                stockCount: 10
            }
        ]
    },
    {
        mediaId: 2,
        title: "Test Media 2",
        type: "Book",
        author: "Test Author 2",
        description: "Test Description 2",
        releaseDate: "2024-01-02",
        imageUrl: "https://example.com/image2.jpg",
        genres: ["Action", "Adventure"],
        mediaStock: [
            {
                locationId: 1,
                locationName: "Sheffield",
                stockCount: 10
            }
        ]
    },
    {
        mediaId: 3,
        title: "Test Media 3",
        type: "Game",
        author: "Test Author 3",
        description: "Test Description 3",
        releaseDate: "2024-01-03",
        imageUrl: "https://example.com/image3.jpg",
        genres: ["Action", "Adventure"],
        mediaStock: [
            {
                locationId: 1,
                locationName: "Sheffield",
                stockCount: 10
            },
            {
                locationId: 2,
                locationName: "Manchester",
                stockCount: 10
            }
        ]
    },
    {
        mediaId: 4,
        title: "Test Media 4",
        type: "Game",
        author: "Test Author 4",
        description: "Test Description 4",
        releaseDate: "2024-01-04",
        imageUrl: "https://example.com/image4.jpg",
        genres: ["Action", "Adventure"],
        mediaStock: []
    }
]