interface BranchOpeningHoursEntity {
    branchid : number,
    dayofweek : number,
    openingtime : number,
    closingtime : number
}

export interface BranchReadModelEntity {
    branchid : number,
    locationid : number,
    branchname : string,
    openinghours : BranchOpeningHoursEntity[],
    renewallimit : number,
    maximumborrowingdurationindays : number
}

