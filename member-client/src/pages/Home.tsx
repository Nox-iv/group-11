import Navigation from "../components/Navigation";
import { Box, IconButton, Typography } from "@mui/material";
import MultiCarousel from "../components/MultiCarousel";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useQueries, useQuery } from "@tanstack/react-query";

import { getSearchFilters } from "../api/getSearchFilters";
import { getAllContentWithType } from "../api/getContent";

export default function Home() {
    const searchFiltersQuery = useQuery({ queryKey: ['searchFilters'], queryFn: getSearchFilters });
    const typeFilters = searchFiltersQuery.data?.types;

    const mediaQueries = useQueries({
        queries: typeFilters?.map(type => ({
            queryKey: ['media', type],
            queryFn: () => getAllContentWithType(type, 0, 10),
        })) ?? [],
    });

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
                    {typeFilters?.map((type, index) => (
                        <Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Typography marginLeft={2} variant="h4">{type}s</Typography>
                                <IconButton>
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Box>
                            <MultiCarousel items={mediaQueries[index]?.data?.map(media => ({
                                id: media.mediaId,
                                title: media.title,
                                description: media.description,
                                imgSrc: media.imageUrl,
                            })) ?? []} />
                        </Box>
                    ))}
                </Box>
            </Box>
        </>
    )
}