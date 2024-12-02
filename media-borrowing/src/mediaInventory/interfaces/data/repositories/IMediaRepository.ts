import { MediaItem } from "../../../data/models";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";

export class IMediaRepository {
    public getItemByMediaAndBranchId(mediaId: number, branchId : number) : Promise<MediaItem | null> {
        throw new NotImplementedError()
    }

    public updateMediaItem(mediaItem : MediaItem) : Promise<void> {
        throw new NotImplementedError()
    }
}