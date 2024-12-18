export interface BranchReadModel {
    branchId: number;
    locationId: number;
    name: string;
    openingHours: [number, [number, number][]][]
    borrowingConfig: {
        maxRenewals: number;
        maxBorrowingPeriod: number;
    };
}