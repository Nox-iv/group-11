import { Branch, BranchResponseModel } from "./types/Branch"
import { mockBranches } from "../../test/data/content"

export const getBranchesByLocationId = async (locationId: number) : Promise<Branch[]> => {
    if (process.env.NODE_ENV === 'development') {

        return mockBranches.filter(b => b.locationId === locationId)
    }

    const response = await fetch(`/api/borrowing/location/${locationId}/branches`)
    const data: BranchResponseModel[] = await response.json()

    return data.map((branch: BranchResponseModel) => ({
      ...branch,
      openingHours: new Map(branch.openingHours)
    }))
}