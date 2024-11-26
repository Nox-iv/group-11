import { MediaBorrowingRecord } from "../../../interfaces/dto"
import { Message } from "../../messaging/Message"
import { NotImplementedError } from "../../errors/notImplementedError"

export class IMediaBorrowingRepository {
    insertBorrowingRecord(userId: number, mediaId: number, startDate: Date, endDate: Date): void {
        throw new NotImplementedError()
    }

    deleteBorrowingRecord(userId: number, mediaId: number): void {
        throw new NotImplementedError()
    }

    extendBorrowingRecord(userId: number, mediaId: number, endDate: Date): void {
        throw new NotImplementedError()
    }

    getBorrowingRecord(userId: number, mediaId: number) : Message<MediaBorrowingRecord> {
        throw new NotImplementedError()
    }

    hasMediaItem(mediaId: number) : Message<boolean> {
        throw new NotImplementedError()
    }

    hasUser(userId: number) : Message<boolean> {
        throw new NotImplementedError()
    }
}