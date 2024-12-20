import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router";

import { Box, Typography,Paper, List, ListItem, ListItemText, useMediaQuery, CircularProgress, Button} from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import Navigation from "../components/navigation/Navigation";
import BorrowingModal from "../components/media-borrowing/BorrowingModal";

import { MediaDocument } from "../api/media-search/types/mediaSearchResult";
import { getMediaById } from "../api/media-search/searchMedia";

import { borrowMedia } from "../api/media-borrowing/borrowMedia";

export default function Details() {
    const location = useLocation();
    const { mediaId } = useParams();

    const useVerticalLayout = useMediaQuery('(max-width:1000px)');

    const [mediaDocument, setMediaDocument] = useState<MediaDocument | undefined>(undefined);
    const [hasMediaData, setHasMediaData] = useState(false);

    const [openBorrowModals, setOpenBorrowModals] = useState<Record<number, boolean>>({});

    const mediaQuery = useQuery({
        queryKey: ["media", mediaId],
        queryFn: () => getMediaById(Number(mediaId)),
        enabled: !location.state?.media && !hasMediaData,
    })

    useEffect(() => {
        if (location.state?.media) {
            setMediaDocument(location.state.media as MediaDocument);
        } else {
            setMediaDocument(mediaQuery.data);
        }

        setHasMediaData(true);
    }, [location.state?.media, mediaQuery.data]);

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
                                            justifyContent: 'space-between',
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
                                        <Box>
                                            <Button 
                                                disabled={stock.stockCount === 0}  
                                                onClick={() => setOpenBorrowModals(prev => ({
                                                    ...prev,
                                                    [stock.locationId]: true
                                                }))}
                                            >
                                                Borrow
                                            </Button>
                                            <BorrowingModal 
                                                label="Borrow" 
                                                mediaLocationId={stock.locationId} 
                                                mediaTitle={mediaDocument.title} 
                                                open={!!openBorrowModals[stock.locationId]}
                                                onSubmit={async (branchId: number, startDate: Date, endDate: Date) => {
                                                    return await borrowMedia(mediaDocument.mediaId, 1, branchId, startDate, endDate);
                                                }}
                                                onClose={() => setOpenBorrowModals(prev => ({
                                                    ...prev,
                                                    [stock.locationId]: false
                                                }))}
                                            />
                                        </Box>
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