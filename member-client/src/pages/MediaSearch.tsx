import { useState, ChangeEvent, useMemo } from "react";

import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  FormGroup,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  Pagination,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";

import { useSearchParams, useNavigate } from "react-router";

import Navigation from "../components/navigation/Navigation";
import Search from "../components/media-search/Search";
import ResultCard from "../components/result/ResultCard";  

import { MediaDocument } from "../api/media-search/types/mediaSearchResult";
import { MediaSearchRequest } from "../api/media-search/types/mediaSearchRequest";
import { searchMedia } from "../api/media-search/searchMedia";
import { getSearchFilters } from "../api/media-search/getSearchFilters";
import { MediaSearchFilters } from "../api/media-search/types/mediaSearchFilters";
import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateValidationError } from "@mui/x-date-pickers/models";

export default function MediaSearch() {
    const navigate = useNavigate();

    // Responsive design hooks
    const isSmallDevice = useMediaQuery('(max-width:900px)');
    const isSmallerDevice = useMediaQuery('(max-width:1150px)');
    const isMediumDevice = useMediaQuery('(max-width:1700px)');

    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('searchTerm');
    const type = searchParams.get('type');

    // State for date range
    const [rangeFrom, setRangeFrom] = useState<Dayjs | null>(null);
    const [rangeTo, setRangeTo] = useState<Dayjs | null>(null);
    const [dateError, setDateError] = useState<DateValidationError | null>(null);

    const dateValidationErrorMessage = useMemo(() => {
        if (dateError === 'minDate') {
            return 'From date cannot be after To date.';
        } else if (dateError === 'maxDate') {
            return 'To date cannot be before From date.';
        }

        return '';
    }, [dateError]);

    const [searchRequest, setSearchRequest] = useState<MediaSearchRequest>({
        searchTerm: searchTerm != null ? searchTerm : '',
        page: 0,
        pageSize: 10,
        availableAtLocation: undefined,
        filters: {
            type: type ? [type] : [],
            genres: [],
        },
        range: {
            releaseDate: {
                from: undefined,
                to: undefined,
            }
        }
    });

    const mediaQuery = useQuery({
        queryKey: ['media', 
            searchRequest.searchTerm, 
            searchRequest.page, 
            searchRequest.pageSize, 
            searchRequest.availableAtLocation, 
            searchRequest.filters?.type,
            searchRequest.filters?.genres,
            searchRequest.range?.releaseDate?.from,
            searchRequest.range?.releaseDate?.to
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

    // Handlers for date range changes
    const handleRangeFromChange = (newValue: Dayjs | null) => {
        if (newValue && rangeTo && newValue.isAfter(rangeTo)) {
            setDateError('minDate');
        } else {
            setDateError(null);
            setRangeFrom(newValue);
            setSearchRequest({
                ...searchRequest,
                range: {
                    ...searchRequest.range,
                    releaseDate: {
                        ...searchRequest.range?.releaseDate,
                        from: newValue ? newValue.toDate() : undefined,
                    },
                },
            });
        }
    };

    const handleRangeToChange = (newValue: Dayjs | null) => {
        if (newValue && rangeFrom && newValue.isBefore(rangeFrom)) {
            setDateError('maxDate');
        } else {
            setDateError(null);
            setRangeTo(newValue);
            setSearchRequest({
                ...searchRequest,
                range: {
                    ...searchRequest.range,
                    releaseDate: {
                        ...searchRequest.range?.releaseDate,
                        to: newValue ? newValue.toDate() : undefined,
                    },
                },
            });
        }
    };

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
                    rangeFrom={searchRequest.range?.releaseDate?.from ? searchRequest.range.releaseDate.from : undefined}
                    rangeTo={searchRequest.range?.releaseDate?.to ? searchRequest.range.releaseDate.to : undefined}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                    <Typography variant="h5" sx={{ ml: 2 }}>Results</Typography>
                    <Stack width="100%" direction="column" margin={2} spacing={2} gap={1}>
                        {mediaQuery.isLoading && <CircularProgress />}
                        {!mediaQuery.isLoading && mediaQuery.data?.data?.map((media: MediaDocument) => (
                            <ResultCard 
                                key={media.mediaId.toString()}
                                resultCardMedia={{
                                    imageUrl: media.imageUrl,
                                    title: media.title,
                                }}
                                resultCardTitle={{
                                    title: media.title,
                                }}
                                resultCardFields={
                                    [
                                        {
                                            label: 'Type',
                                            value: media.type,
                                        },
                                        {
                                            label: 'Publisher',
                                            value: media.author,
                                        },
                                        {
                                            label: 'Release Date',
                                            value: new Date(media.releaseDate).toLocaleDateString(),
                                        },
                                        {
                                            label: 'Genres',
                                            value: media.genres.join(', '),
                                        },
                                    ]
                                }
                                onClick={() => navigate(`/details/${media.mediaId}`, { state: { media } })}
                            />
                        ))}
                    </Stack>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4, width: '30%' }}>
                    <Typography variant="h5" sx={{ marginBottom: 2 }}>Filters</Typography>
                    <Box>
                        {filterQuery.isLoading && <CircularProgress />}
                        {!filterQuery.isLoading && (
                            <Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="h6">Release Date</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <DatePicker
                                            label="From"
                                            value={rangeFrom}
                                            onChange={handleRangeFromChange}
                                            disableFuture
                                            maxDate={rangeTo ?? undefined}
                                            onError={(error) => setDateError(error)}
                                        />
                                        <DatePicker
                                            label="To"
                                            value={rangeTo}
                                            onChange={handleRangeToChange}
                                            disableFuture
                                            minDate={rangeFrom ?? undefined}
                                            onError={(error) => setDateError(error)}
                                        />
                                    </Box>
                                    {dateError && <Typography variant="body2" color="error">{dateValidationErrorMessage}</Typography>}
                                </Box>
                                {
                                    filterQuery.data && Object.entries(filterQuery.data).map(([key, value]) => (
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
                                    ))
                                }
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
            <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 2 }}>
                <Pagination count={Math.ceil(mediaQuery.data?.totalHits ? mediaQuery.data.totalHits / searchRequest.pageSize : 1)} page={searchRequest.page + 1} onChange={handlePageChange} />
            </Stack>
        </Box>
    );
}