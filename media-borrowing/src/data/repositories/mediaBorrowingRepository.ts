import { IMediaBorrowingRepository } from "../../interfaces/data/repositories";
import { MediaBorrowingRecord } from "../../logic";
import { IUnitOfWork } from "../../interfaces/data/uow";
import { Message } from "../../interfaces/messaging/Message";

export class MediaBorrowingRepository extends IMediaBorrowingRepository {
    private uow : IUnitOfWork
    
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    insertBorrowingRecord(mediaBorrowingRecord: MediaBorrowingRecord): void {
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
    

    getBorrowingRecord(userId: number, mediaId: number) : Message<MediaBorrowingRecord> {
        return new Message({} as MediaBorrowingRecord)
    }
} 