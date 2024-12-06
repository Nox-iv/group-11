export interface MediaBorrowingRecordListingDetailsEntity {
    mediaborrowingrecordid : number,
    startdate : Date,
    enddate : Date,
    renewals : number,
    mediaid : number,
    mediatype : string,
    title : string,
    author : string,
    asseturl : string,
    branchid : number,
    branchname : string,
}