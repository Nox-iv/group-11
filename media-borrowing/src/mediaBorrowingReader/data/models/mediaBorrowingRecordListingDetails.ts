export interface MediaBorrowingRecordListingDetails {
    mediaBorrowingRecordId : number,
    startDate : Date,
    endDate : Date,
    renewals : number,
    mediaId : number,
    mediaType : string,
    title : string,
    author : string,
    assetUrl : string,
    branch: {
        branchId: number;
        locationId: number;
        name: string;
        openingHours: [number, [number, number][]][]
        borrowingConfig: {
            maxRenewals: number;
            maxBorrowingPeriod: number;
        };
    }
}