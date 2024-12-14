import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import MultiCarousel from "../components/MultiCarousel";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useQueries, useQuery } from "@tanstack/react-query";

import { Link, useNavigate } from "react-router";

import Navigation from "../components/Navigation";
import { getSearchFilters } from "../api/getSearchFilters";
import { getAllMediaWithType } from "../api/getMedia";

export default function Home() {
    const navigate = useNavigate();
    const searchFiltersQuery = useQuery({ queryKey: ['search', 'filters'], queryFn: getSearchFilters });
    const typeFilters = searchFiltersQuery.data?.type;

    const mediaQueries = useQueries({
        queries: typeFilters?.map(type => ({
            queryKey: ['media', type],
            queryFn: () => getAllMediaWithType(type, 0, 10),
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
                    {mediaQueries.some(query => query.isLoading) && (
                        <CircularProgress />
                    )}
                    {mediaQueries.every(query => query.isSuccess) && !searchFiltersQuery.isLoading && (
                        <Box>
                            {typeFilters?.map((type, index) => (
                                <Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography marginLeft={2} variant="h4">{type}s</Typography>
                                        <Link to={`/search?type=${type}`}>
                                            <IconButton>
                                                <ArrowForwardIcon />
                                            </IconButton>
                                        </Link>
                                    </Box>
                                    <MultiCarousel 
                                        items={mediaQueries[index]?.data?.map(media => ({
                                            key: media.mediaId.toString(),
                                            title: media.title,
                                            description: media.description,
                                            imgSrc: media.imageUrl,
                                            onClick: () => navigate(`/details/${media.mediaId}`, { state: { media } })
                                        })) ?? []} 
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    )
}