import { IMediaRepository } from "../../interfaces/data/repositories";
import { IUnitOfWork } from "../../../db/interfaces/uow";
import { MediaItem } from "../models";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { Message } from "../../../shared/messaging/Message";

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
} 