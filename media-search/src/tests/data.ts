import { MediaSearchResult } from "../mediaSearch/data/documents/mediaSearchResult.d";

export const mediaSearchResultTestData : MediaSearchResult[] = [
    {
        mediaId: 1,
        title: "The Dark Knight",
        type: "Movie",
        author: "Christopher Nolan",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        releaseDate: "2008-07-18",
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
        title: "The Hobbit",
        type: "Book",
        author: "J.R.R. Tolkien",
        description: "Bilbo Baggins, a hobbit enjoying his quiet life, is swept into an epic quest by Gandalf the Grey and thirteen dwarves who seek to reclaim their mountain home from Smaug, the dragon.",
        releaseDate: "1937-09-21",
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
        title: "The Legend of Zelda: Breath of the Wild",
        type: "Game",
        author: "Nintendo",
        description: "Step into a world of discovery, exploration, and adventure in this open-air adventure where you'll discover who you truly are.",
        releaseDate: "2017-03-03",
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
        title: "Red Dead Redemption 2",
        type: "Game",
        author: "Rockstar Games",
        description: "America, 1899. Arthur Morgan and the Van der Linde gang are outlaws on the run. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America.",
        releaseDate: "2018-10-26",
        imageUrl: "https://example.com/image4.jpg",
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
    }
]

export const testDataIdx = {
    THE_DARK_KNIGHT: 0,
    THE_HOBBIT: 1,
    THE_LEGEND_OF_ZELDA: 2,
    RED_DEAD_REDEMPTION_2: 3
}