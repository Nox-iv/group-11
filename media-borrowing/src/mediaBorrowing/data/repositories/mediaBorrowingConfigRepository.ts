import { Inject } from "typedi"
import { Message } from "../../../shared/messaging/Message"
import { IUnitOfWork } from "../../../db/interfaces/uow"
import { IMediaBorrowingConfigRepository } from "../../interfaces/data/repositories"

export class MediaBorrowingConfigRepository extends IMediaBorrowingConfigRepository {
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async getRenewalLimit(branchId : number) : Promise<number | null> {
        const connection = this.uow.getTransaction().getConnection()
        const result = await connection.query<number>(`
            SELECT 
                MediaBorrowingConfig.renewalLimit 
            FROM 
                Branch_MediaBorrowingConfig 
            INNER JOIN
                MediaBorrowingConfig ON MediaBorrowingConfig.mediaBorrowingConfigId = Branch_MediaBorrowingConfig.mediaBorrowingConfigId
            WHERE 
                branchId = $1`, [branchId])

        if (result.length == 0) {
            return null
        }

        return result[0]
    }

    public async getMaximumBorrowingDurationInDays(branchId : number) : Promise<number | null>  {
        const connection = this.uow.getTransaction().getConnection()
        const result = await connection.query<number>(`
            SELECT 
                MediaBorrowingConfig.maximumBorrowingDurationInDays 
            FROM 
                Branch_MediaBorrowingConfig 
            INNER JOIN
                MediaBorrowingConfig ON MediaBorrowingConfig.mediaBorrowingConfigId = Branch_MediaBorrowingConfig.mediaBorrowingConfigId
            WHERE 
                branchId = $1`, [branchId])

        if (result.length == 0) {
            return null
        }

        return result[0]
    }
}