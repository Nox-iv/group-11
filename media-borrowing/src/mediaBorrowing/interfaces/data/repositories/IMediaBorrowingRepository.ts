import { MediaBorrowingRecord } from "../../../data/models"
import { Message } from "../../../../shared/messaging/Message"
import { NotImplementedError } from "../../../../shared/errors/notImplementedError"

export class IMediaBorrowingRepository {
    public async insertBorrowingRecord(mediaBorrowingRecord : MediaBorrowingRecord): Promise<void> {
        throw new NotImplementedError()
    }

    public updateBorrowingRecord(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<void> {
        throw new NotImplementedError()
    }

    public archiveBorrowingRecord(mediaBorrowingRecordId : number) : Promise<void> {
        throw new NotImplementedError()
    }

    public hasBorrowingRecord(userId : number, mediaId: number, branchId : number) : Promise<boolean> {
        throw new NotImplementedError()
    }

    public getBorrowingRecordById(mediaBorrowingRecordId : number) : Promise<MediaBorrowingRecord | null> {
        throw new NotImplementedError()
    }
}