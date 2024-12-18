import { userRecordsMap, mockBorrowingRecords } from "../../test/data/content";
import { MediaBorrowingRecordDetails } from "./types/mediaBorrowingRecordDetails";

export const getMediaBorrowingRecords = async (userId: number, offset: number, limit: number) : Promise<MediaBorrowingRecordDetails[]> => {
    if (process.env.NODE_ENV === 'development') {
        const userRecordIds = userRecordsMap[userId];

        return mockBorrowingRecords
            .filter(record => userRecordIds.includes(record.mediaBorrowingRecordId))
            .slice(offset, offset + limit);
    }

    const response = await fetch(`${import.meta.env.VITE_MEDIA_BORROWING_API_URL}/user/${userId}/records?offset=${offset}&limit=${limit}`);

    return response.json();
}