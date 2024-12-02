import { BranchDetails } from "./branchDetails";
import { MediaDetails } from "./mediaDetails";

export interface MediaBorrowingRecordDetails {
    mediaBorrowingRecordId : number,
    startDate : Date,
    endDate : Date,
    renewals : number,
    mediaDetails : MediaDetails
    branchDetails : BranchDetails
}