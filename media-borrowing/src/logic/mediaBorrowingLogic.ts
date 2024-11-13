import { MediaBorrowingRecord } from "./mediaBorrowingRecord"

export function addMediaBorrowingRecord(userId: number, mediaItemId: number, startDate: Date, endDate: Date): MediaBorrowingRecord {
    if (endDate < startDate) {
        throw new Error('End date cannot be earlier than start date.')
    }

    return {
        userId: userId,
        mediaItemId: mediaItemId,
        startDate: startDate,
        endDate: endDate,
        renewals: 0
    } 
}