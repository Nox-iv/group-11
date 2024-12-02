import { IUnitOfWork } from "../../../db/interfaces/uow";
import { MediaInventoryRecord } from "../models";
import { IMediaInventoryRepository } from "../../interfaces/data/repositories/IMediaInventoryRepository";

export class MediaInventoryRepository extends IMediaInventoryRepository {
    private uow : IUnitOfWork
    
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async getInventoryByMediaAndBranchId(mediaId: number, branchId : number) : Promise<MediaInventoryRecord | null> {
        const connection = this.uow.getTransaction().getConnection()
        const result = await connection.query<MediaInventoryRecord>("SELECT * FROM MediaInventory WHERE mediaId = $1 AND branchId = $2", [mediaId, branchId])

        if (result.length == 0) {
            return null
        }

        return result[0]
    }

    public async updateMediaItemAvailability(mediaInventoryRecord : MediaInventoryRecord) : Promise<void> {
        const connection = this.uow.getTransaction().getConnection()

        await connection.command(
            `UPDATE MediaItems SET availability = $1 WHERE id = $2`,
            [mediaInventoryRecord.availability, mediaInventoryRecord.mediaInventoryId]
        )
    }
} 