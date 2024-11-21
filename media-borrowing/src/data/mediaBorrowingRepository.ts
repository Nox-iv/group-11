import { Service } from "typedi";
import { IMediaBorrowingRepository } from "../interfaces";
import { MediaBorrowingRecord } from "../logic";
import { UUID } from "crypto";

@Service()
export class MediaBorrowingRepository extends IMediaBorrowingRepository {
    constructor() {
        super()
    }

    insertBorrowingRecord(userId: UUID, mediaId: UUID, startDate: Date, endDate: Date): void {
        // Check record doesn't already exist for item and user ID
        // Insert record
    }

    deleteBorrowingRecord(userId: UUID, mediaId: UUID): void {
        // Delete record if exists
        // Throw if record does not exist or could not be deleted
    }

    extendBorrowingRecord(userId: UUID, mediaId: UUID, endDate: Date): void {
        // Update media borrowing record date
        // Throw if record does not exist.
    }

    getBorrowingRecordsByUserId(userId: UUID) : MediaBorrowingRecord[] {
        return []
    }
} 