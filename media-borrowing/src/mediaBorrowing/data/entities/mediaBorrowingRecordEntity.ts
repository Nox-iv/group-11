export interface MediaBorrowingRecordEntity {
    mediaborrowingrecordid : number,
    userid : number,
    mediaid: number,
    branchid : number,
    startdate: Date,
    enddate : Date,
    renewals : number
}