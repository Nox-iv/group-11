import { MediaBorrowingRecord } from "./mediaBorrowingRecord"

export function addMediaBorrowingRecord(userId: number, mediaItemId: number, startDate: Date, endDate: Date): MediaBorrowingRecord {
    return {
        userId: userId,
        mediaItemId: mediaItemId,
        startDate: startDate,
        endDate: endDate,
        renewals: 0
    } 
}