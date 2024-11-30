import { Message } from "../../../../shared/messaging/Message";
import { MediaItem } from "../../../data/models";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";

export class IMediaRepository {
    public branchHasMediaItem(mediaId: number, branchId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public getByMediaAndBranchId(mediaId: number, branchId : number) : Promise<Message<MediaItem>> {
        throw new NotImplementedError()
    }

    public updateMediaItem(mediaItem : MediaItem) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}