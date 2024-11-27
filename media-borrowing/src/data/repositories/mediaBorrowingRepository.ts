import { IMediaBorrowingRepository } from "../../interfaces/data/repositories";
import { MediaBorrowingRecord } from "../../interfaces/dto/MediaBorrowingRecord";
import { IUnitOfWork } from "../../interfaces/data/uow";
import { Message } from "../../interfaces/messaging/Message";
import { NotImplementedError } from "../../interfaces/errors/notImplementedError";

export class MediaBorrowingRepository extends IMediaBorrowingRepository {
    private uow : IUnitOfWork
    
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public insertBorrowingRecord(mediaBorrowingRecord: MediaBorrowingRecord): void {
        // Check record doesn't already exist for item and user ID
        // Insert record
    }

    public async updateBorrowingRecord(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<void> {

    }

    public deleteBorrowingRecord(userId: number, mediaId: number): void {
        // Delete record if exists
        // Throw if record does not exist or could not be deleted
    }

    public extendBorrowingRecord(userId: number, mediaId: number, endDate: Date): void {
        // Update media borrowing record date
        // Throw if record does not exist.
    }
    

    public getBorrowingRecordById(mediaBorrowingRecord : number) : Promise<Message<MediaBorrowingRecord>> {
        throw new NotImplementedError()
    }
} 