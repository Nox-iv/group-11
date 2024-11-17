import { MediaBorrowingRecord } from "../../logic"

export interface IMediaBorrowingRepository {
    insertBorrowingRecord(userId: number, mediaId: number, startDate: Date, endDate: Date): void
    deleteBorrowingRecord(userId: number, mediaId: number): void
    extendBorrowingRecord(userId: number, mediaId: number, endDate: Date): void
    getBorrowingRecordsByUserId(userId: number) : MediaBorrowingRecord[]
}