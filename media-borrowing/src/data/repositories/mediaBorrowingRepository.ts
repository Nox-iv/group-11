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

    public insertBorrowingRecord(mediaBorrowingRecord: MediaBorrowingRecord): Promise<void> {
        throw new NotImplementedError()
    }

    public async updateBorrowingRecord(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<void> {

    }

    public checkBorrowingRecordExists(userId : number, mediaId: number, branchId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public async archiveBorrowingRecord(mediaBorrowingRecordId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public getBorrowingRecordById(mediaBorrowingRecordId : number) : Promise<Message<MediaBorrowingRecord>> {
        throw new NotImplementedError()
    }
} 