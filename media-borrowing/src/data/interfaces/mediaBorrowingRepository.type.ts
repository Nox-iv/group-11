export interface IMediaBorrowingRepository {
    insertBorrowingRecord(userId: number, mediaId: number, startDate: Date, endDate: Date): void
    deleteBorrowingRecord(userId: number, mediaId: number): void
}