import { MediaInventoryRecord } from "../../../data/models/MediaInventoryRecord"
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";

export class IMediaInventoryRepository {
    public getInventoryByMediaAndBranchId(mediaId: number, branchId : number) : Promise<MediaInventoryRecord | null> {
        throw new NotImplementedError()
    }

    public updateMediaItemAvailability(mediaInventoryRecord : MediaInventoryRecord) : Promise<void> {
        throw new NotImplementedError()
    }
}