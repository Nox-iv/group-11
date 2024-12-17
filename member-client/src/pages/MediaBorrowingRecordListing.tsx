import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { useParams } from "react-router";

import { Box, Typography, CircularProgress, Stack, Tooltip } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';

import Navigation from "../components/navigation/Navigation";

import { getMediaBorrowingRecords } from "../api/media-borrowing/getMediaBorrowingRecords";
import { MediaBorrowingRecordDetails } from "../api/media-borrowing/types/mediaBorrowingRecordDetails";
import ResultCard from "../components/result/ResultCard";
import BorrowingModal from "../components/media-borrowing/BorrowingModal";
import dayjs from "dayjs";
import { renewMedia } from "../api/media-borrowing/renewMedia";

export default function MediaBorrowingRecordListing() {
    const { userId } = useParams();
    
    const { data, isLoading, error } = useQuery<MediaBorrowingRecordDetails[]>({
        queryKey: ['media-borrowing', 'records', userId],
        queryFn: () => getMediaBorrowingRecords(Number(userId), 0, 10),
    });

    const [openRenewalModal, setOpenRenewalModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MediaBorrowingRecordDetails | null>(null);

    return (
        <Box>
            <Navigation />
            <Box>
                <Box display="flex" alignItems="center">
                    <Typography variant="h4" margin={2}>Your Borrowed Items</Typography>
                    <Tooltip title="Click on an item to issue a renewal. If an item is not clickable, it means you have already reached the maximum number of renewals for that item.">
                        <HelpIcon />
                    </Tooltip>
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
                                    disabled={record.renewals >= record.branch.maxRenewals}
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
                                            { label: 'Branch', value: record.branch.name },
                                            { label: 'Start Date', value: record.startDate.toLocaleString('en-GB') },
                                            { label: 'End Date', value: record.endDate.toLocaleString('en-GB') },
                                        ]
                                    }
                                    onClick={() => {
                                        setSelectedRecord(record);
                                        setOpenRenewalModal(true);
                                    }}
                                />
                            ))}
                        </Stack>
                        {selectedRecord && (
                            <BorrowingModal 
                                label="Renew"
                                mediaLocationId={selectedRecord.branch.locationId} 
                                mediaTitle={selectedRecord.title} 
                                renewal={
                                    {
                                        startDate: dayjs(selectedRecord.startDate),
                                        endDate: dayjs(selectedRecord.endDate),
                                        branch: selectedRecord.branch,
                                    }
                                }
                                open={openRenewalModal}
                                onSubmit={async (branchId: number, startDate: Date, endDate: Date) => {
                                    return await renewMedia(selectedRecord.mediaId, endDate);
                                }}
                                onClose={() => {
                                    setOpenRenewalModal(false);
                                    setSelectedRecord(null);
                                }}
                            />
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    )
}