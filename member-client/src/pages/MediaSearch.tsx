import { Box, Stack } from "@mui/material";
import Navigation from "../components/Navigation";
import Search from "../components/Search";
import ResultCard from "../components/ResultCard";  

export default function MediaSearch() {
    return (
        <Box>
            <Navigation searchHidden={true}/>
            <Box margin={2}>
                <Search width="100%" hidden={false} />
            </Box>
            <Stack direction="column" margin={2} spacing={2} gap={1}>
                <ResultCard />
                <ResultCard />
                <ResultCard />
                <ResultCard />
            </Stack>
        </Box>
    );
}