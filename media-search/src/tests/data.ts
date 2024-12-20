import { MediaDocument } from "../mediaSearch/data/documents/mediaSearchResult.d";

export const mediaSearchResultTestData : MediaDocument[] = [
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
    },
    {
        mediaId: 5,
        title: "The Hobbit: An Unexpected Journey",
        type: "Movie",
        author: "Peter Jackson",
        description: "A reluctant Hobbit, Bilbo Baggins, sets out to the Lonely Mountain with a spirited group of dwarves to reclaim their mountain home, and the gold within it from the dragon Smaug.",
        releaseDate: "2012-12-14",
        imageUrl: "https://example.com/image5.jpg",
        genres: ["Action", "Adventure", "Fantasy"],
        mediaStock: [
            {
                locationId: 1,
                locationName: "Sheffield",
                stockCount: 0
            },
            {
                locationId: 2,
                locationName: "Manchester",
                stockCount: 10
            }
        ]
    },
    {
        mediaId: 6,
        title: "The Lord of the Rings: The Fellowship of the Ring",
        type: "Movie",
        author: "Peter Jackson",
        description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
        releaseDate: "2001-12-19",
        imageUrl: "https://example.com/image6.jpg",
        genres: ["Action", "Adventure", "Fantasy"],
        mediaStock: [
            {
                locationId: 1,
                locationName: "Sheffield",
                stockCount: 0
            },
            {
                locationId: 2,
                locationName: "Manchester",
                stockCount: 1
            }
        ]
    },
    {
        mediaId: 7,
        title: "The Lord of the Rings: The Two Towers",
        type: "Movie",
        author: "Peter Jackson",
        description: "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
        releaseDate: "2002-12-18",
        imageUrl: "https://example.com/image7.jpg",
        genres: ["Action", "Adventure", "Fantasy"],
        mediaStock: [
            {
                locationId: 1,
                locationName: "Sheffield",
                stockCount: 0
            },
            {
                locationId: 2,
                locationName: "Manchester",
                stockCount: 2
            }
        ]
    },
    {
        mediaId: 8,
        title: "The Lord of the Rings: The Return of the King",
        type: "Movie",
        author: "Peter Jackson",
        description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
        releaseDate: "2003-12-17",
        imageUrl: "https://example.com/image8.jpg",
        genres: ["Action", "Adventure", "Fantasy"],
        mediaStock: [
            {
                locationId: 1,
                locationName: "Sheffield",
                stockCount: 0
            },
            {
                locationId: 2,
                locationName: "Manchester",
                stockCount: 0
            }
        ]
    },
    {
        mediaId: 9,
        title: "The Lord of the Rings: The Return of the King",
        type: "Game",
        author: "EA Games",
        description: "Based on the epic film trilogy, play through the most memorable battles from The Lord of the Rings as you embark on the quest to destroy the One Ring and save Middle-earth.",
        releaseDate: "2003-11-05",
        imageUrl: "https://example.com/image9.jpg",
        genres: ["Action", "Adventure", "Fantasy"],
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
        mediaId: 10,
        title: "Dune",
        type: "Book",
        author: "Frank Herbert",
        description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
        releaseDate: "1965-08-01",
        imageUrl: "https://example.com/image10.jpg",
        genres: ["Fantasy", "Sci-Fi"],
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
        mediaId: 11,
        title: "Star Wars: A New Hope",
        type: "Movie",
        author: "George Lucas",
        description: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station.",
        releaseDate: "1977-05-25",
        imageUrl: "https://example.com/image11.jpg",
        genres: ["Fantasy", "Sci-Fi"],
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
    THE_HOBBIT_BOOK: 1,
    THE_LEGEND_OF_ZELDA: 2,
    RED_DEAD_REDEMPTION_2: 3,
    THE_HOBBIT_MOVIE: 4,
    LOTR_FELLOWSHIP: 5,
    LOTR_TWO_TOWERS: 6,
    LOTR_RETURN_KING: 7,
    LOTR_GAME: 8,
    DUNE: 9,
    STAR_WARS_NEW_HOPE: 10
}