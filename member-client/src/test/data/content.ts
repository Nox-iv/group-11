import { MediaDocument } from "../../api/types/mediaSearchResult";

export const mockContent: MediaDocument[] = [
    // Books
    {
        mediaId: 1001,
        title: "1984",
        type: "Book",
        author: "George Orwell",
        description: "A dystopian novel set in a totalitarian society, following Winston Smith's rebellion against the omnipresent government surveillance.",
        releaseDate: "1949-06-08",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/Nineteen_Eighty-Four_cover_Soviet_1984.jpg",
        genres: ["Sci-Fi", "Drama"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 3 },
            { locationId: 2, locationName: "London", stockCount: 2 }
        ]
    },
    {
        mediaId: 1002,
        title: "The Lord of the Rings",
        type: "Book",
        author: "J.R.R. Tolkien",
        description: "An epic high-fantasy novel following the hobbit Frodo Baggins on his quest to destroy the One Ring.",
        releaseDate: "1954-07-29",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/e9/First_Single_Volume_Edition_of_The_Lord_of_the_Rings.gif",
        genres: ["Fantasy", "Adventure"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 4 },
            { locationId: 3, locationName: "Manchester", stockCount: 2 }
        ]
    },
    {
        mediaId: 1003,
        title: "Project Hail Mary",
        type: "Book",
        author: "Andy Weir",
        description: "A lone astronaut must save humanity from extinction in this interstellar adventure from the author of The Martian.",
        releaseDate: "2021-05-04",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/Project_Hail_Mary%2C_First_Edition_Cover_%282021%29.jpg/220px-Project_Hail_Mary%2C_First_Edition_Cover_%282021%29.jpg",
        genres: ["Sci-Fi", "Adventure"],
        mediaStock: [
            { locationId: 2, locationName: "London", stockCount: 5 }
        ]
    },
    {
        mediaId: 1004,
        title: "Dune",
        type: "Book",
        author: "Frank Herbert",
        description: "A science fiction masterpiece about politics, religion, and power on a desert planet that holds the universe's most valuable resource.",
        releaseDate: "1965-08-01",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/de/Dune-Frank_Herbert_%281965%29_First_edition.jpg",
        genres: ["Sci-Fi", "Adventure"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 2 },
            { locationId: 3, locationName: "Manchester", stockCount: 3 }
        ]
    },
    {
        mediaId: 1005,
        title: "The Shining",
        type: "Book",
        author: "Stephen King",
        description: "A psychological horror novel about a family serving as winter caretakers of the isolated Overlook Hotel.",
        releaseDate: "1977-01-28",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/The_Shining_%281977%29_front_cover%2C_first_edition.jpg/318px-The_Shining_%281977%29_front_cover%2C_first_edition.jpg",
        genres: ["Horror", "Thriller"],
        mediaStock: [
            { locationId: 2, locationName: "London", stockCount: 4 }
        ]
    },

    // Movies
    {
        mediaId: 2001,
        title: "The Matrix",
        type: "Movie",
        author: "The Wachowskis",
        description: "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.",
        releaseDate: "1999-03-31",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
        genres: ["Sci-Fi", "Action"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 3 },
            { locationId: 2, locationName: "London", stockCount: 5 }
        ]
    },
    {
        mediaId: 2002,
        title: "Inception",
        type: "Movie",
        author: "Christopher Nolan",
        description: "A thief who enters the dreams of others to steal secrets is offered a chance to regain his old life in exchange for a task considered impossible.",
        releaseDate: "2010-07-16",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
        genres: ["Sci-Fi", "Action", "Thriller"],
        mediaStock: [
            { locationId: 3, locationName: "Manchester", stockCount: 2 }
        ]
    },
    {
        mediaId: 2003,
        title: "Spirited Away",
        type: "Movie",
        author: "Hayao Miyazaki",
        description: "A young girl enters a mysterious world of spirits and must work to save her parents who have been transformed into pigs.",
        releaseDate: "2001-07-20",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png",
        genres: ["Animation", "Fantasy", "Adventure"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 2 },
            { locationId: 2, locationName: "London", stockCount: 3 }
        ]
    },

    // Games
    {
        mediaId: 3001,
        title: "The Legend of Zelda: Breath of the Wild",
        type: "Game",
        author: "Nintendo",
        description: "An action-adventure game set in a vast open world where players explore the kingdom of Hyrule while fighting to save it.",
        releaseDate: "2017-03-03",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
        genres: ["Action", "Adventure", "Fantasy"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 4 },
            { locationId: 3, locationName: "Manchester", stockCount: 2 }
        ]
    },
    {
        mediaId: 3002,
        title: "Red Dead Redemption 2",
        type: "Game",
        author: "Rockstar Games",
        description: "An epic tale of life in America's unforgiving heartland, following the story of outlaw Arthur Morgan.",
        releaseDate: "2018-10-26",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg",
        genres: ["Action", "Western", "Adventure"],
        mediaStock: [
            { locationId: 2, locationName: "London", stockCount: 3 }
        ]
    },
    {
        mediaId: 3003,
        title: "Elden Ring",
        type: "Game",
        author: "FromSoftware",
        description: "An action RPG set in a vast fantasy realm, created in collaboration with George R.R. Martin.",
        releaseDate: "2022-02-25",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg",
        genres: ["Fantasy", "Action"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 2 },
            { locationId: 3, locationName: "Manchester", stockCount: 1 }
        ]
    },
    {
        mediaId: 3004,
        title: "God of War",
        type: "Game",
        author: "Santa Monica Studio",
        description: "A father-son journey through Norse mythology, blending action and emotional storytelling.",
        releaseDate: "2018-04-20",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/a7/God_of_War_4_cover.jpg",
        genres: ["Action", "Adventure", "Fantasy"],
        mediaStock: [
            { locationId: 2, locationName: "London", stockCount: 4 }
        ]
    },
    {
        mediaId: 3005,
        title: "Portal 2",
        type: "Game",
        author: "Valve",
        description: "A first-person puzzle game featuring a series of challenging test chambers and witty AI antagonists.",
        releaseDate: "2011-04-19",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/f9/Portal2cover.jpg",
        genres: ["Sci-Fi", "Adventure"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 3 }
        ]
    },
    {
        mediaId: 2004,
        title: "The Godfather",
        type: "Movie",
        author: "Francis Ford Coppola",
        description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
        releaseDate: "1972-03-14",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
        genres: ["Crime", "Drama"],
        mediaStock: [
            { locationId: 2, locationName: "London", stockCount: 3 },
            { locationId: 3, locationName: "Manchester", stockCount: 2 }
        ]
    },
    {
        mediaId: 2005,
        title: "Pulp Fiction",
        type: "Movie",
        author: "Quentin Tarantino",
        description: "Various interconnected stories of Los Angeles criminals, small-time mobsters, and a mysterious briefcase.",
        releaseDate: "1994-10-14",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg",
        genres: ["Crime", "Drama"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 2 }
        ]
    },
    {
        mediaId: 2006,
        title: "The Dark Knight",
        type: "Movie",
        author: "Christopher Nolan",
        description: "Batman faces his greatest challenge as the Joker terrorizes Gotham City.",
        releaseDate: "2008-07-18",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg",
        genres: ["Action", "Crime", "Drama"],
        mediaStock: [
            { locationId: 2, locationName: "London", stockCount: 4 },
            { locationId: 3, locationName: "Manchester", stockCount: 1 }
        ]
    },
    {
        mediaId: 1006,
        title: "Pride and Prejudice",
        type: "Book",
        author: "Jane Austen",
        description: "A romantic novel following the emotional development of Elizabeth Bennet.",
        releaseDate: "1813-01-28",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/PrideAndPrejudiceTitlePage.jpg",
        genres: ["Romance", "Drama"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 5 }
        ]
    },
    {
        mediaId: 1007,
        title: "The Hitchhiker's Guide to the Galaxy",
        type: "Book",
        author: "Douglas Adams",
        description: "A comedic science fiction series following the adventures of Arthur Dent through space.",
        releaseDate: "1979-10-12",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/bd/H2G2_UK_front_cover.jpg",
        genres: ["Sci-Fi", "Comedy"],
        mediaStock: [
            { locationId: 2, locationName: "London", stockCount: 3 },
            { locationId: 3, locationName: "Manchester", stockCount: 2 }
        ]
    },
    {
        mediaId: 1008,
        title: "The Hobbit",
        type: "Book",
        author: "J.R.R. Tolkien",
        description: "The tale of Bilbo Baggins' journey with a group of dwarves to reclaim their mountain home.",
        releaseDate: "1937-09-21",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg",
        genres: ["Fantasy", "Adventure"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 4 }
        ]
    },
    {
        mediaId: 2007,
        title: "Jurassic Park",
        type: "Movie",
        author: "Steven Spielberg",
        description: "Dinosaurs are brought back to life in a theme park, with catastrophic consequences.",
        releaseDate: "1993-06-11",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg",
        genres: ["Sci-Fi", "Adventure", "Thriller"],
        mediaStock: [
            { locationId: 2, locationName: "London", stockCount: 3 },
            { locationId: 3, locationName: "Manchester", stockCount: 2 }
        ]
    },
    {
        mediaId: 2008,
        title: "The Shawshank Redemption",
        type: "Movie",
        author: "Frank Darabont",
        description: "A banker, sentenced to life in Shawshank State Penitentiary, never loses hope.",
        releaseDate: "1994-09-23",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg",
        genres: ["Drama"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 2 }
        ]
    },
    {
        mediaId: 3006,
        title: "The Witcher 3: Wild Hunt",
        type: "Game",
        author: "CD Projekt Red",
        description: "An action RPG following monster hunter Geralt of Rivia in a vast fantasy world.",
        releaseDate: "2015-05-19",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg",
        genres: ["Fantasy", "Action", "Adventure"],
        mediaStock: [
            { locationId: 2, locationName: "London", stockCount: 3 }
        ]
    },
    {
        mediaId: 3007,
        title: "Mass Effect 2",
        type: "Game",
        author: "BioWare",
        description: "A sci-fi RPG where Commander Shepard must save humanity from an ancient threat.",
        releaseDate: "2010-01-26",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/0/05/MassEffect2_cover.PNG",
        genres: ["Sci-Fi", "Action"],
        mediaStock: [
            { locationId: 3, locationName: "Manchester", stockCount: 2 }
        ]
    },
    {
        mediaId: 1009,
        title: "Neuromancer",
        type: "Book",
        author: "William Gibson",
        description: "A groundbreaking cyberpunk novel about a washed-up hacker pulled into a mysterious heist.",
        releaseDate: "1984-07-01",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/4b/Neuromancer_%28Book%29.jpg",
        genres: ["Sci-Fi", "Thriller"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 3 }
        ]
    },
    {
        mediaId: 2009,
        title: "Blade Runner",
        type: "Movie",
        author: "Ridley Scott",
        description: "A blade runner must pursue and terminate four replicants who stole a ship in space.",
        releaseDate: "1982-06-25",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/9f/Blade_Runner_%281982_poster%29.png",
        genres: ["Sci-Fi", "Thriller"],
        mediaStock: [
            { locationId: 2, locationName: "London", stockCount: 2 }
        ]
    },
    {
        mediaId: 3008,
        title: "Half-Life 2",
        type: "Game",
        author: "Valve",
        description: "A sci-fi FPS following Gordon Freeman's fight against alien occupation of Earth.",
        releaseDate: "2004-11-16",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/25/Half-Life_2_cover.jpg",
        genres: ["Sci-Fi", "Action"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 2 },
            { locationId: 3, locationName: "Manchester", stockCount: 1 }
        ]
    },
    {
        mediaId: 1010,
        title: "Foundation",
        type: "Book",
        author: "Isaac Asimov",
        description: "A science fiction novel about the decline and rebirth of a galactic empire.",
        releaseDate: "1951-05-01",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Foundation_-_Isaac_Asimov_%28Gnome_1951%29.jpg/220px-Foundation_-_Isaac_Asimov_%28Gnome_1951%29.jpg",
        genres: ["Sci-Fi"],
        mediaStock: [
            { locationId: 2, locationName: "London", stockCount: 4 }
        ]
    },
    {
        mediaId: 2010,
        title: "The Lion King",
        type: "Movie",
        author: "Roger Allers",
        description: "A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.",
        releaseDate: "1994-06-15",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg",
        genres: ["Animation", "Drama", "Adventure"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 3 },
            { locationId: 3, locationName: "Manchester", stockCount: 2 }
        ]
    },
    {
        mediaId: 3009,
        title: "BioShock",
        type: "Game",
        author: "2K Games",
        description: "A first-person shooter set in the underwater city of Rapture, exploring themes of free will and objectivism.",
        releaseDate: "2007-08-21",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/6/6d/BioShock_cover.jpg",
        genres: ["Action", "Horror", "Sci-Fi"],
        mediaStock: [
            { locationId: 2, locationName: "London", stockCount: 2 }
        ]
    },
    {
        mediaId: 3010,
        title: "Minecraft",
        type: "Game",
        author: "Mojang",
        description: "A sandbox game allowing players to build and explore in a procedurally generated world.",
        releaseDate: "2011-11-18",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b6/Minecraft_2024_cover_art.png",
        genres: ["Adventure"],
        mediaStock: [
            { locationId: 1, locationName: "Sheffield", stockCount: 5 },
            { locationId: 2, locationName: "London", stockCount: 3 },
            { locationId: 3, locationName: "Manchester", stockCount: 4 }
        ]
    }
]