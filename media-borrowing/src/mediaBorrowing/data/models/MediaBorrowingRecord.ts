export interface MediaBorrowingRecord {
    mediaBorrowingRecordId : number,
    userId : number,
    mediaId: number,
    branchId : number,
    startDate: Date,
    endDate : Date,
    renewals : number
}