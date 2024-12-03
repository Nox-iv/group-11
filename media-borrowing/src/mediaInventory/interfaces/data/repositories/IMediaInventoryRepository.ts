import { MediaInventoryRecord } from "../../../data/models/MediaInventoryRecord"
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { IUnitOfWork } from "../../../../db/interfaces/uow";

export class IMediaInventoryRepository {

    //@ts-ignore
    protected uow : IUnitOfWork

    constructor() {}

    public getInventoryByMediaAndBranchId(mediaId: number, branchId : number) : Promise<MediaInventoryRecord | null> {
        throw new NotImplementedError()
    }

    public updateMediaItemAvailability(mediaInventoryRecord : MediaInventoryRecord) : Promise<void> {
        throw new NotImplementedError()
    }
}