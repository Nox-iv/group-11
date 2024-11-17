export type MediaBorrowingRecord = {
    userId: number,
    mediaId: number,
    startDate: Date,
    endDate: Date,
    renewals: number
}