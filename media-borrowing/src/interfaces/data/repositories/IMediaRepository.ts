import { Message } from "../../messaging/Message";
import { NotImplementedError } from "../../errors/notImplementedError";
import { MediaItem } from "../../dto/MediaItem";

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