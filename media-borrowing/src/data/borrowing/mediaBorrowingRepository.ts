import { Service } from "typedi";

@Service()
export class MediaBorrowingRepository {
    constructor() {}

    insertBorrowingRecord(userId: number, mediaId: number, startDate: Date, endDate: Date): void {
        // Check record doesn't already exist for item and user ID
        // Insert record
    }
} 