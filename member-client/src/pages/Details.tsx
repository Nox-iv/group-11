import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router";

import { Box, Typography,Paper, List, ListItem, ListItemText, useMediaQuery, CircularProgress} from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import Navigation from "../components/Navigation";
import BookingModal from "../components/BookingModal";

import { MediaDocument } from "../api/types/mediaSearchResult";
import { getMediaById } from "../api/getMedia";

export default function Details() {
    const location = useLocation();
    const { mediaId } = useParams();

    const useVerticalLayout = useMediaQuery('(max-width:1000px)');

    const [mediaDocument, setMediaDocument] = useState<MediaDocument | undefined>(undefined);
    const [hasMediaData, setHasMediaData] = useState(false);

    useEffect(() => {
        if (location.state?.media) {
            setMediaDocument(location.state.media as MediaDocument);
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
            setMediaDocument(mediaQuery.data);
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
            {hasMediaData && mediaDocument && (
                <Box sx={{ p: 4 }}>
                    <Box display={useVerticalLayout ? "column" : "flex"} gap={2}>
                        <Box sx={{objectFit: 'contain'}} width={useVerticalLayout ? "100%" : "50%"} textAlign="center">
                            {useVerticalLayout && (
                                <Typography variant="h3" gutterBottom>
                                    {mediaDocument.title}
                                </Typography>
                            )}
                            <img 
                                src={mediaDocument.imageUrl} 
                                alt={mediaDocument.title} 
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
                                    {mediaDocument.title}
                                </Typography>
                            )}
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Type</Typography>}
                                        secondary={mediaDocument.type}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Release Date</Typography>}
                                        secondary={new Date(mediaDocument.releaseDate).toLocaleDateString()}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Publisher</Typography>}
                                        secondary={mediaDocument.author}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Description</Typography>}
                                        secondary={mediaDocument.description}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Genres</Typography>}
                                        secondary={mediaDocument.genres.join(', ')}
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
                            {mediaDocument.mediaStock.map((stock, index) => (
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