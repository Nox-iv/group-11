import { IMediaRepository } from "../../interfaces/data/repositories";
import { IUnitOfWork } from "../../../db/interfaces/uow";
import { MediaItem } from "../models";

export class MediaRepository extends IMediaRepository {
    private uow : IUnitOfWork
    
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async getItemByMediaAndBranchId(mediaId: number, branchId : number) : Promise<MediaItem | null> {
        const connection = this.uow.getTransaction().getConnection()
        const result = await connection.query<MediaItem>("SELECT * FROM MediaItems WHERE id = $1 AND branch_id = $2", [mediaId, branchId])

        if (result.length == 0) {
            return null
        }

        return result[0]
    }

    public async updateMediaItemAvailability(mediaItem : MediaItem) : Promise<void> {
        const connection = this.uow.getTransaction().getConnection()

        await connection.command(
            `UPDATE MediaItems SET availability = $1 WHERE id = $2`,
            [mediaItem.availability, mediaItem.mediaItemId]
        )
    }
} 