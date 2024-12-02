import { IUnitOfWork } from '../../../db/interfaces/uow'
import { BranchOpeningHours } from '../../../mediaBorrowing/data/models'
import { IBranchRepository } from '../../interfaces/data/repositories'

export class BranchRepository extends IBranchRepository {
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async getOpeningHoursById(branchId : number) : Promise<BranchOpeningHours | null> {
        const connection = this.uow.getTransaction().getConnection()
        const result = await connection.query<BranchOpeningHours>("SELECT * FROM Branch_BranchOpeningHours WHERE branchId = $1", [branchId])

        if (result.length == 0) {
            return null
        }

        return result[0]
    }

    public async getBranchLocationId(branchId : number) : Promise<number | null> {
        const connection = this.uow.getTransaction().getConnection()
        const result = await connection.query<number>("SELECT locationId FROM Branches WHERE branchId = $1", [branchId])

        if (result.length == 0) {
            return null
        }

        return result[0]
    }
}