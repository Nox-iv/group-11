import { Service } from "typedi";
import { IMediaBorrowingRepository } from "../interfaces";
import { MediaBorrowingRecord } from "../logic";

@Service()
export class MediaBorrowingRepository extends IMediaBorrowingRepository {
    constructor() {
        super()
    }

    insertBorrowingRecord(userId: number, mediaId: number, startDate: Date, endDate: Date): void {
        // Check record doesn't already exist for item and user ID
        // Insert record
    }

    deleteBorrowingRecord(userId: number, mediaId: number): void {
        // Delete record if exists
        // Throw if record does not exist or could not be deleted
    }

    extendBorrowingRecord(userId: number, mediaId: number, endDate: Date): void {
        // Update media borrowing record date
        // Throw if record does not exist.
    }

    getBorrowingRecordsByUserId(userId: number) : MediaBorrowingRecord[] {
        return []
    }
} 