import { MediaBorrowingRecord } from "../types/mediaBorrowingRecord"

export class MediaBorrowingLogic {
    constructor() {}

    addMediaBorrowingRecord(userId: number, mediaItemId: number, startDate: Date, endDate: Date): MediaBorrowingRecord {
        if (endDate < startDate) {
            throw new Error('End date cannot be earlier than start date.')
        }
    
        if (userId > 10) {
            throw new Error(`User ${userId} does not exist`)
        }
    
        return {
            userId: userId,
            mediaItemId: mediaItemId,
            startDate: startDate,
            endDate: endDate,
            renewals: 0
        } 
    }
}