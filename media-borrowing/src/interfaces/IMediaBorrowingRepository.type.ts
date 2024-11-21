import { UUID } from "crypto"
import { MediaBorrowingRecord } from "../logic"
import { NotImplementedError } from "./errors/notImplementedError"

export class IMediaBorrowingRepository {
    insertBorrowingRecord(userId: UUID, mediaId: UUID, startDate: Date, endDate: Date): void {
        throw new NotImplementedError()
    }

    deleteBorrowingRecord(userId: UUID, mediaId: UUID): void {
        throw new NotImplementedError()
    }

    extendBorrowingRecord(userId: UUID, mediaId: UUID, endDate: Date): void {
        throw new NotImplementedError()
    }

    getBorrowingRecordsByUserId(userId: UUID) : MediaBorrowingRecord[] {
        throw new NotImplementedError()
    }

    hasMediaItem(mediaId: UUID) : boolean {
        throw new NotImplementedError()
    }

    hasUser(userId: UUID) : boolean {
        throw new NotImplementedError()
    }
}