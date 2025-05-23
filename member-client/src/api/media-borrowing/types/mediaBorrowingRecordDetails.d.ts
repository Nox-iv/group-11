export interface MediaBorrowingRecordDetails {
    mediaBorrowingRecordId : number,
    startDate : Date,
    endDate : Date,
    renewals : number,
    mediaId : number,
    mediaType : string,
    title : string,
    author : string,
    assetUrl : string,
    branch : Branch,
}