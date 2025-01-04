export interface Branch {
    branchId: number;
    locationId: number;
    name: string;
    openingHours: Map<number, [number, number][]>;
    borrowingConfig: {
        maxRenewals: number;
        maxBorrowingPeriod: number;
    };
}

export interface BranchResponseModel {
    branchId: number;
    locationId: number;
    name: string;
    openingHours: [number, [number, number][]][]
    borrowingConfig: {
        maxRenewals: number;
        maxBorrowingPeriod: number;
    };
}