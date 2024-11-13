export type MediaBorrowingRecord = {
    userId: number;
    mediaItemId: number;
    startDate: Date;
    endDate: Date;
    renewals: number;
}