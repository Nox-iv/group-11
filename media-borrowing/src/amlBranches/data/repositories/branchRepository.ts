import { IUnitOfWork } from '../../../db/interfaces/uow'
import { BranchOpeningHoursEntity } from '../entities/BranchOpeningHoursEntity'
import { BranchOpeningHours } from '../../../mediaBorrowing/data/models'
import { IBranchRepository } from '../../interfaces/data/repositories'

export class BranchRepository extends IBranchRepository {
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async getOpeningHoursById(branchId : number) : Promise<BranchOpeningHours | null> {
        const connection = this.uow.getTransaction().getConnection()
        const result = await connection.query<BranchOpeningHoursEntity>(`
            SELECT 
                *
            FROM 
                BranchOpeningHours bh
            WHERE 
                branchId = $1`, [branchId])

        if (result.length == 0) {
            return null
        }
        
        const dayOfWeekToOpeningHours = new Map<number, [number, number][]>()
        for (let i = 0; i < 7; i++) {
            dayOfWeekToOpeningHours.set(i, [])
        }

        for (const entity of result) {
            const [dayOfWeek, openingHour, closingHour] = [entity.dayOfWeek, entity.openingHour, entity.closingHour]
            dayOfWeekToOpeningHours.get(dayOfWeek)?.push([openingHour, closingHour])
        }

        return new BranchOpeningHours(dayOfWeekToOpeningHours)
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