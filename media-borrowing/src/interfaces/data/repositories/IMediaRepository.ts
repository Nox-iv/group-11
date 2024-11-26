import { Message } from "../../messaging/Message";
import { NotImplementedError } from "../../errors/notImplementedError";
import { MediaItem } from "../../dto/MediaItem";

export class IMediaRepository {
    public hasMedia(mediaId: number, branchId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public getMedia(mediaId: number, branchId : number) : Promise<Message<MediaItem>> {
        throw new NotImplementedError()
    }
}