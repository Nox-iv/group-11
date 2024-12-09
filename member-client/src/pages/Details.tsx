import { Box, Typography,Paper, List, ListItem, ListItemText, useMediaQuery} from "@mui/material";
import Navigation from "../components/Navigation";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import BookingModal from "../components/BookingModal";

export default function Details() {

    const branches = [
        { name: "Sheffield Central", available: true },
        { name: "Sheffield North", available: false },
        { name: "Sheffield South", available: true },
        { name: "Sheffield East", available: false },
    ];

    const useVerticalLayout = useMediaQuery('(max-width:1000px)');

    return (
        <Box>
            <Navigation />
            
            <Box sx={{ p: 4 }}>
                <Box display={useVerticalLayout ? "column" : "flex"} gap={2}>
                    <Box width={useVerticalLayout ? "100%" : "50%"} textAlign="center">
                        {useVerticalLayout && (
                            <Typography variant="h3" gutterBottom>
                                Item Title
                            </Typography>
                        )}
                        <img 
                            src="https://picsum.photos/500/700" 
                            alt="Item cover" 
                            style={{ 
                                width: '100%', 
                                maxHeight: '600px',
                                maxWidth: '600px',
                                borderRadius: '8px'
                            }} 
                        />
                    </Box>
                    <Box>
                        {!useVerticalLayout && (
                            <Typography variant="h3" gutterBottom>
                                Item Title
                            </Typography>
                        )}
                        <List>
                            <ListItem>
                                <ListItemText 
                                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Release Date</Typography>}
                                    secondary="January 1, 2024"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Publisher</Typography>}
                                    secondary="Publisher Name"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Description</Typography>}
                                    secondary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
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
                        {branches.map((branch, index) => (
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
                                                color: branch.available ? 'success.main' : 'error.main',
                                                fontSize: 16
                                            }} 
                                        />
                                        <Typography>{branch.name}</Typography>
                                    </Box>
                                    <BookingModal disabled={!branch.available} />
                                </Paper>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}