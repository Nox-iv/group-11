export interface MediaBorrowingRecord {
    userId : number,
    mediaId: number,
    startDate: Date,
    endDate : Date,
    renewals : number
}