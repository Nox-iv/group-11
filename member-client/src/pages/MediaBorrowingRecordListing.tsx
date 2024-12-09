import { Box, Typography, Stack } from "@mui/material";

import Navigation from "../components/Navigation";
import ResultCard from "../components/ResultCard";

export default function MediaBorrowingRecordListing() {
    return (
        <Box>
            <Navigation />
            <Box>
                <Box>
                    <Typography variant="h4" margin={2}>Your Borrowed Items</Typography>
                </Box>
                <Box>
                    <Stack direction="column" spacing={2} margin={2}>
                        <ResultCard />
                        <ResultCard />
                        <ResultCard />
                        <ResultCard />
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}