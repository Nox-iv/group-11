import { Service } from "typedi";
import { IMediaBorrowingRepository } from "./interfaces/mediaBorrowingRepository.type";

@Service()
export class MediaBorrowingRepository implements IMediaBorrowingRepository {
    constructor() {}

    insertBorrowingRecord(userId: number, mediaId: number, startDate: Date, endDate: Date): void {
        // Check record doesn't already exist for item and user ID
        // Insert record
    }

    deleteBorrowingRecord(userId: number, mediaId: number): void {
        // Delete record if exists
        // Throw if record does not exist or could not be deleted
    }
} 