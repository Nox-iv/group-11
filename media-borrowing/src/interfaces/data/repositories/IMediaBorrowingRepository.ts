import { MediaBorrowingRecord } from "../../../interfaces/dto"
import { Message } from "../../messaging/Message"
import { NotImplementedError } from "../../errors/notImplementedError"

export class IMediaBorrowingRepository {
    insertBorrowingRecord(mediaBorrowingRecord : MediaBorrowingRecord): void {
        throw new NotImplementedError()
    }

    deleteBorrowingRecord(userId: number, mediaId: number): void {
        throw new NotImplementedError()
    }

    extendBorrowingRecord(userId: number, mediaId: number, endDate: Date): void {
        throw new NotImplementedError()
    }

    hasBorrowingRecord(userId : number, mediaId: number): Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public getBorrowingRecord(userId: number, mediaId: number) : Promise<Message<MediaBorrowingRecord>> {
        throw new NotImplementedError()
    }
}