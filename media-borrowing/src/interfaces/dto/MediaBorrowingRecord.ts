export interface MediaBorrowingRecord {
    userId : number,
    mediaId: number,
    branchId : number,
    startDate: Date,
    endDate : Date,
    renewals : number
}