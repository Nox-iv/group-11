import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router";

import { Box, Typography,Paper, List, ListItem, ListItemText, useMediaQuery, CircularProgress} from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import Navigation from "../components/Navigation";
import BookingModal from "../components/BookingModal";

import { MediaSearchResult } from "../api/types/mediaSearchResult";
import { getMediaById } from "../api/getMedia";

export default function Details() {
    const location = useLocation();
    const { mediaId } = useParams();

    const useVerticalLayout = useMediaQuery('(max-width:1000px)');

    const [mediaSearchResult, setMediaSearchResult] = useState<MediaSearchResult | undefined>(undefined);
    const [hasMediaData, setHasMediaData] = useState(false);

    useEffect(() => {
        if (location.state?.media) {
            setMediaSearchResult(location.state.media as MediaSearchResult);
            setHasMediaData(true);
        }
    }, [location.state?.media]);

    const mediaQuery = useQuery({
        queryKey: ["media", mediaId],
        queryFn: () => getMediaById(Number(mediaId)),
        enabled: !location.state?.media,
    })

    useEffect(() => {
        if (mediaQuery.data) {
            setMediaSearchResult(mediaQuery.data);
            setHasMediaData(true);
        }
    }, [mediaQuery.data]);

    return (
        <Box>
            <Navigation />
            
            {!hasMediaData && mediaQuery.isLoading && (
                <Box sx={{ margin: '-30px auto', width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            )}
            {!hasMediaData && !mediaQuery.isLoading && (
                <Box sx={{ margin: '-30px auto', width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        No media data found
                    </Typography>
                </Box>
            )}
            {hasMediaData && mediaSearchResult && (
                <Box sx={{ p: 4 }}>
                    <Box display={useVerticalLayout ? "column" : "flex"} gap={2}>
                        <Box sx={{objectFit: 'contain'}} width={useVerticalLayout ? "100%" : "50%"} textAlign="center">
                            {useVerticalLayout && (
                                <Typography variant="h3" gutterBottom>
                                    {mediaSearchResult.title}
                                </Typography>
                            )}
                            <img 
                                src={mediaSearchResult.imageUrl} 
                                alt={mediaSearchResult.title} 
                                style={{ 
                                    width: '100%', 
                                    maxHeight: '600px',
                                    maxWidth: '600px',
                                    borderRadius: '8px'
                                }} 
                            />
                        </Box>
                        <Box width={useVerticalLayout ? "100%" : "50%"}>
                            {!useVerticalLayout && (
                                <Typography variant="h3" gutterBottom>
                                    {mediaSearchResult.title}
                                </Typography>
                            )}
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Type</Typography>}
                                        secondary={mediaSearchResult.type}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Release Date</Typography>}
                                        secondary={new Date(mediaSearchResult.releaseDate).toLocaleDateString()}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Publisher</Typography>}
                                        secondary={mediaSearchResult.author}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Description</Typography>}
                                        secondary={mediaSearchResult.description}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Genres</Typography>}
                                        secondary={mediaSearchResult.genres.join(', ')}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            Availability
                        </Typography>
                
                        <Box display="flex" flexDirection="column" gap={2}>
                            {mediaSearchResult.mediaStock.map((stock, index) => (
                                <Box key={index}>
                                    <Paper 
                                        sx={{ 
                                            p: 2, 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between' 
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <FiberManualRecordIcon 
                                                sx={{ 
                                                    color: stock.stockCount > 0 ? 'success.main' : 'error.main',
                                                    fontSize: 16
                                                }}
                                            />
                                            <Typography>{stock.locationName}</Typography>
                                        </Box>
                                        <BookingModal disabled={stock.stockCount === 0} />
                                    </Paper>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}