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

    public async archiveBorrowingRecord(mediaBorrowingRecordId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public getBorrowingRecordById(mediaBorrowingRecord : number) : Promise<Message<MediaBorrowingRecord>> {
        throw new NotImplementedError()
    }
} 