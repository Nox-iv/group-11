import { BranchOpeningHours } from "../../../mediaBorrowing/data/models";

export interface BranchDetails {
    branchId : number,
    name : string,
    locationName : string,
    openingHours : BranchOpeningHours
}