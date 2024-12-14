import { useState, ChangeEvent, useEffect } from "react";

import { Box, CircularProgress, Stack, Typography, FormGroup, Checkbox, FormControlLabel, useMediaQuery, Pagination } from "@mui/material";

import { useQuery } from "@tanstack/react-query";

import { useSearchParams, useNavigate } from "react-router";

import Navigation from "../components/Navigation";
import Search from "../components/Search";
import ResultCard from "../components/ResultCard";  

import { MediaDocument } from "../api/types/mediaSearchResult";
import { MediaSearchRequest } from "../api/types/mediaSearchRequest";
import { searchMedia } from "../api/media-search/searchMedia";
import { getSearchFilters } from "../api/media-search/getSearchFilters";
import { MediaSearchFilters } from "../api/types/mediaSearchFilters";

export default function MediaSearch() {
    const navigate = useNavigate();

    // TODO : Hide filters behind dropdowns on mobile
    const isSmallDevice = useMediaQuery('(max-width:900px)');
    const isSmallerDevice = useMediaQuery('(max-width:1150px)');
    const isMediumDevice = useMediaQuery('(max-width:1700px)');

    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('searchTerm');
    const type = searchParams.get('type');

    const [totalHits, setTotalHits] = useState<number>(0);

    const [searchRequest, setSearchRequest] = useState<MediaSearchRequest>({
        searchTerm: searchTerm != null ? searchTerm : '',
        page: 0,
        pageSize: 10,
        availableAtLocation: undefined,
        filters: {
            type: type ? [type] : [],
        }
    });

    const mediaQuery = useQuery({
        queryKey: ['media', 
            searchRequest.searchTerm, 
            searchRequest.page, 
            searchRequest.pageSize, 
            searchRequest.availableAtLocation, 
            searchRequest.filters?.type,
            searchRequest.filters?.genres
        ],
        queryFn: () => searchMedia(searchRequest),
    });

    const filterQuery = useQuery({
        queryKey: ['search', 'filters'],
        queryFn: () => getSearchFilters(),
    });

    const handleFilterChange = (event: ChangeEvent<HTMLInputElement>, key: string, value: string) => {
        if (event.target.checked && !searchRequest.filters?.[key as keyof MediaSearchFilters]?.includes(value)) {
            setSearchRequest({
                ...searchRequest,
                filters: {
                    ...searchRequest.filters,
                    [key]: [
                        ...(searchRequest.filters?.[key as keyof MediaSearchFilters] || []), 
                        value
                    ],
                },
            });
        } else if (!event.target.checked && searchRequest.filters?.[key as keyof MediaSearchFilters]?.includes(value)) {
            setSearchRequest({
                ...searchRequest,
                filters: {
                    ...searchRequest.filters,
                    [key]: (searchRequest.filters?.[key as keyof MediaSearchFilters] || []).filter((item: string) => item !== value),
                },
            });
        }
    }

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setSearchRequest({
            ...searchRequest,
            page: value - 1,
        });
    };

    useEffect(() => {
        if (mediaQuery.data?.totalHits) {
            console.log(mediaQuery.data.totalHits);
            setTotalHits(mediaQuery.data.totalHits);
        }
    }, [mediaQuery.data?.totalHits]);

    return (
        <Box>
            <Navigation searchHidden={true}/>
            <Box margin={2}>
                <Search 
                    width="100%" 
                    hidden={false} 
                    onSearch={(searchTerm: string) => setSearchRequest({ ...searchRequest, searchTerm })}
                    searchTerm={searchRequest.searchTerm}
                    filters={searchRequest.filters}
                    availableAtLocation={searchRequest.availableAtLocation}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                    <Typography variant="h5" sx={{ ml: 2 }}>Results</Typography>
                    <Stack width="100%" direction="column" margin={2} spacing={2} gap={1}>
                        {mediaQuery.isLoading && <CircularProgress />}
                        {!mediaQuery.isLoading && mediaQuery.data?.data?.map((media: MediaDocument) => (
                            <ResultCard 
                                media={media} 
                                onClick={() => navigate(`/details/${media.mediaId}`, { state: { media } })}
                            />
                        ))}
                    </Stack>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4, width: '30%' }}>
                    <Typography variant="h5" sx={{ marginBottom: 2 }}>Filters</Typography>
                    <Box>
                        {filterQuery.isLoading && <CircularProgress />}
                        {!filterQuery.isLoading && filterQuery.data && Object.entries(filterQuery.data).map(([key, value]) => (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="h6">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
                                <FormGroup sx={{ display: 'flex', flexDirection: isSmallDevice ? 'column' : 'row' }}>
                                    {value.map((item: string) => (
                                        <FormControlLabel
                                            sx={{ width: isSmallerDevice ? '40%' : isMediumDevice ? '30%' : '20%' }}
                                            control={
                                                <Checkbox
                                                    value={item}
                                                    checked={searchRequest.filters?.[key as keyof MediaSearchFilters]?.includes(item) ?? false}
                                                    onChange={(event) => handleFilterChange(event, key, item)}
                                                />
                                            }
                                            label={item}
                                        />
                                    ))}
                                </FormGroup>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
            <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 2 }}>
                <Pagination count={Math.ceil(totalHits / searchRequest.pageSize)} page={searchRequest.page + 1} onChange={handlePageChange} />
            </Stack>
        </Box>
    );
}