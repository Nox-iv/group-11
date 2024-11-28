import { MediaBorrowingRecord } from "../../../interfaces/dto"
import { Message } from "../../messaging/Message"
import { NotImplementedError } from "../../errors/notImplementedError"

export class IMediaBorrowingRepository {
    public insertBorrowingRecord(mediaBorrowingRecord : MediaBorrowingRecord): void {
        throw new NotImplementedError()
    }

    public updateBorrowingRecord(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<void> {
        throw new NotImplementedError()
    }

    public archiveBorrowingRecord(mediaBorrowingRecordId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public hasBorrowingRecord(userId : number, mediaId: number): Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public getBorrowingRecordById(mediaBorrowingRecordId : number) : Promise<Message<MediaBorrowingRecord>> {
        throw new NotImplementedError()
    }
}