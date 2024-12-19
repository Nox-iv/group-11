import { userRecordsMap, mockBorrowingRecords } from "../../test/data/content";
import { MediaBorrowingRecordDetails } from "./types/mediaBorrowingRecordDetails";

export const getMediaBorrowingRecords = async (userId: number, offset: number, limit: number) : Promise<MediaBorrowingRecordDetails[]> => {
    if (process.env.NODE_ENV === 'development') {
        const userRecordIds = userRecordsMap[userId];

        return mockBorrowingRecords
            .filter(record => userRecordIds.includes(record.mediaBorrowingRecordId))
            .slice(offset, offset + limit);
    }

    const response = await fetch(`${import.meta.env.VITE_MEDIA_BORROWING_API_URL}/user/${userId}/records?offset=${offset}&limit=${limit}`, {
        headers: {
            'Accept': 'application/json',
        }
    });

    const data = await response.json();
    console.log(data)

    const res = data.map((record: MediaBorrowingRecordDetails) => ({
        ...record,
        branch: {
            ...record.branch,
            openingHours: new Map(record.branch.openingHours)
        }
    }))

    console.log(res)

    return res;
}