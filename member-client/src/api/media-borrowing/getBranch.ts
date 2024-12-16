import { Branch, BranchResponseModel } from "./types/Branch"

export const getBranchesByLocationId = async (locationId: number) : Promise<Branch[]> => {
    if (process.env.NODE_ENV === 'development') {
        const branch = {
            branchId: 1,
            locationId: 1,
            name: "Sheffield Central",
            openingHours: new Map<number, [number, number][]>([
              [0, [[900, 1700]]],
              [1, [[900, 1700]]],
              [2, [[900, 1700]]],
              [3, [[900, 1700]]],
              [4, [[900, 1700]]],
              [5, [[900, 1700]]],
              [6, [[900, 1700]]]
            ]),
            borrowingConfig: {
              maxRenewals: 1,
              maxBorrowingPeriod: 14
            }
        }
        
        const branch2 = {
          branchId: 2,
          locationId : 1,
          name: "Sheffield South",
          openingHours: new Map<number, [number, number][]>([
            [0, [[1000, 1800]]],
            [1, [[1000, 1800]]],
            [2, [[1000, 1800]]],
            [3, [[1000, 1800]]],
            [4, [[1000, 1800]]],
            [5, [[1000, 1800]]],
            [6, [[1000, 1800]]]
          ]),
          borrowingConfig: {
            maxRenewals: 1,
            maxBorrowingPeriod: 7
          }
        }

        const branch3 = {
          branchId: 3,
          locationId: 3,
          name: "Manchester Central",
          openingHours: new Map<number, [number, number][]>([
            [0, [[1000, 1800]]],
            [1, [[1000, 1800]]],
            [2, [[1000, 1800]]],
            [3, [[1000, 1800]]],
            [4, [[1000, 1800]]],
            [5, [[1000, 1800]]],
            [6, [[1000, 1800]]]
          ]),
          borrowingConfig: {
            maxRenewals: 1,
            maxBorrowingPeriod: 7
          }
        }

        const branch4 = {
          branchId: 4,
          locationId: 2,
          name: "London Central",
          openingHours: new Map<number, [number, number][]>([
            [0, [[0, 200], [1000, 2359]]],
            [1, [[0, 200], [1000, 2359]]],
            [2, [[0, 200], [1000, 2359]]],
            [3, [[0, 200], [1000, 2359]]],
            [4, [[0, 200], [1000, 2359]]],
            [5, [[0, 200], [1000, 2359]]],
            [6, [[0, 200], [1000, 2359]]]
          ]),
          borrowingConfig: {
            maxRenewals: 1,
            maxBorrowingPeriod: 14
          }
        }

        return [branch, branch2, branch3, branch4].filter(b => b.locationId === locationId)
    }

    const response = await fetch(`/api/borrowing/location/${locationId}/branches`)
    const data: BranchResponseModel[] = await response.json()

    return data.map((branch: BranchResponseModel) => ({
      ...branch,
      openingHours: new Map(branch.openingHours)
    }))
}