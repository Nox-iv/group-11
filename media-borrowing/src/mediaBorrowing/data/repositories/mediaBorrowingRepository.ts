import { IMediaBorrowingRepository } from "../../interfaces/data/repositories";
import { IUnitOfWork } from "../../../db/interfaces/uow";
import { MediaBorrowingRecord } from "../models";
import { Message } from "../../../shared/messaging/Message";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";

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

    public doesBorrowingRecordExist(userId : number, mediaId: number, branchId : number) : Promise<boolean> {
        throw new NotImplementedError()
    }

    public async archiveBorrowingRecord(mediaBorrowingRecordId : number) : Promise<void> {
        throw new NotImplementedError()
    }

    public getBorrowingRecordById(mediaBorrowingRecordId : number) : Promise<MediaBorrowingRecord | null> {
        throw new NotImplementedError()
    }
} 