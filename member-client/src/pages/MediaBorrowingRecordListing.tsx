import { useQuery } from "@tanstack/react-query";

import { useParams } from "react-router";

import { Box, Typography, CircularProgress, Stack } from "@mui/material";

import Navigation from "../components/navigation/Navigation";

import { getMediaBorrowingRecords } from "../api/media-borrowing/getMediaBorrowingRecords";
import { MediaBorrowingRecordDetails } from "../api/media-borrowing/types/mediaBorrowingRecordDetails";
import ResultCard from "../components/result/ResultCard";

export default function MediaBorrowingRecordListing() {
    const { userId } = useParams();
    
    const { data, isLoading, error } = useQuery<MediaBorrowingRecordDetails[]>({
        queryKey: ['media-borrowing', 'records', userId],
        queryFn: () => getMediaBorrowingRecords(Number(userId), 0, 10),
    });

    return (
        <Box>
            <Navigation />
            <Box>
                <Box>
                    <Typography variant="h4" margin={2}>Your Borrowed Items</Typography>
                </Box>
                {isLoading && 
                    <Box sx={{ margin: '0 auto', width: '100%', height: '65vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </Box>
                }
                {error && <Typography margin={2} variant="h6">Error loading borrowing records</Typography>}
                {!isLoading && !error && data && data.length > 0 && (
                    <Box>
                        <Stack direction="column" spacing={2} margin={2}>
                            {data?.map(record => (
                                <ResultCard
                                    key={record.mediaBorrowingRecordId.toString()}
                                    resultCardMedia={{
                                        imageUrl: record.assetUrl,
                                        title: record.title,
                                    }}
                                    resultCardTitle={{
                                        title: record.title,
                                    }}
                                    resultCardFields={
                                        [
                                            { label: 'Author', value: record.author },
                                            { label: 'Branch', value: record.branchName },
                                            { label: 'Start Date', value: record.startDate.toLocaleString('en-GB') },
                                            { label: 'End Date', value: record.endDate.toLocaleString('en-GB') },
                                        ]
                                    }
                                />
                            ))}
                        </Stack>
                    </Box>
                )}
            </Box>
        </Box>
    )
}