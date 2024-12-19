import { BranchOpeningHoursEntity } from "../../../amlBranchReader/data/entities/BranchReadModelEntity";

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
    locationid : number,
    branchname : string,
    openinghours : BranchOpeningHoursEntity[],
    renewallimit : number,
    maximumborrowingdurationindays : number
    
}