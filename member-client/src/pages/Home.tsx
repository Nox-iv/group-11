import Navigation from "../components/Navigation";
import { Box, Typography } from "@mui/material";
import MultiCarousel from "../components/MultiCarousel";

export default function Home() {
    const books = [
        {
            title: 'Book 1',
            author: 'Author 1',
            description: 'Description 1',   
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
        {
            title: 'Book 2',
            author: 'Author 2',
            description: 'Description 2',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
        {
            title: 'Book 3',
            author: 'Author 3',
            description: 'Description 3',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
        {
            title: 'Book 4',
            author: 'Author 4',
            description: 'Description 4',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
        {
            title: 'Book 5',
            author: 'Author 5',
            description: 'Description 5',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
    ];

    const films = [
        {
            title: 'Film 1',
            director: 'Director 1',
            description: 'Description 1',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
        {
            title: 'Film 2',
            director: 'Director 2',
            description: 'Description 2',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
        {
            title: 'Film 3',
            director: 'Director 3',
            description: 'Description 3',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
        {
            title: 'Film 4',
            director: 'Director 4',
            description: 'Description 4',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
        {
            title: 'Film 5',
            director: 'Director 5',
            description: 'Description 5',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
    ];

    const games = [
        {
            title: 'Game 1',
            developer: 'Developer 1',
            description: 'Description 1',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
        {
            title: 'Game 2',
            developer: 'Developer 2',
            description: 'Description 2',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
        {
            title: 'Game 3',
            developer: 'Developer 3',
            description: 'Description 3',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
        {
            title: 'Game 4',
            developer: 'Developer 4',
            description: 'Description 4',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
        {
            title: 'Game 5',
            developer: 'Developer 5',
            description: 'Description 5',
            imgSrc: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800',
        },
    ];

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Navigation />
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyItems: 'space-around',
                    gap: 2,
                    padding: 2,
                }}>
                    <Typography variant="h4">Books</Typography>
                    <MultiCarousel items={books} />
                    <Typography variant="h4">Films</Typography>
                    <MultiCarousel items={films} />
                    <Typography variant="h4">Games</Typography>
                    <MultiCarousel items={games} />
                </Box>
            </Box>
        </>
    )
}