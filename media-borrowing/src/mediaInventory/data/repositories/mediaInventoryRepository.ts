import { IUnitOfWork } from "../../../db/interfaces/uow";
import { MediaInventoryRecord } from "../models";
import { IMediaInventoryRepository } from "../../interfaces/data/repositories/IMediaInventoryRepository";
import { MediaInventoryRecordEntity } from "../entities/mediaInventoryRecordEntity";

export class MediaInventoryRepository extends IMediaInventoryRepository {
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async getInventoryByMediaAndBranchId(mediaId: number, branchId : number) : Promise<MediaInventoryRecord | null> {
        const connection = this.uow.getTransaction().getConnection()
        const result = await connection.query<MediaInventoryRecordEntity>("SELECT * FROM MediaInventory WHERE mediaId = $1 AND branchId = $2", [mediaId, branchId])

        if (result.length == 0) {
            return null
        }

        const mediaInventoryRecord = result[0]

        return {
            mediaInventoryId: mediaInventoryRecord.mediainventoryid,
            mediaId: mediaInventoryRecord.mediaid,
            branchId: mediaInventoryRecord.branchid,
            availability: mediaInventoryRecord.availability
        }
    }

    public async updateMediaItemAvailability(mediaInventoryRecord : MediaInventoryRecord) : Promise<void> {
        const connection = this.uow.getTransaction().getConnection()

        await connection.command(
            `UPDATE MediaInventory SET availability = $1 WHERE mediaInventoryId = $2`,
            [mediaInventoryRecord.availability, mediaInventoryRecord.mediaInventoryId]
        )
    }
} 