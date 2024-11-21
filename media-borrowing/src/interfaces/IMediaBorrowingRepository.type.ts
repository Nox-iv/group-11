import { MediaBorrowingRecord } from "../logic"
import { NotImplementedError } from "./errors/notImplementedError"

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

    getBorrowingRecordsByUserId(userId: number) : MediaBorrowingRecord[] {
        throw new NotImplementedError()
    }
}