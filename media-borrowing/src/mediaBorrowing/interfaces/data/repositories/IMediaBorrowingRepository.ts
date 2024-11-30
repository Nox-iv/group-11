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

    public archiveBorrowingRecord(mediaBorrowingRecordId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public checkBorrowingRecordExists(userId : number, mediaId: number, branchId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public getBorrowingRecordById(mediaBorrowingRecordId : number) : Promise<Message<MediaBorrowingRecord>> {
        throw new NotImplementedError()
    }
}