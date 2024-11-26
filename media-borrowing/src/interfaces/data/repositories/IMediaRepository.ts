import { Message } from "../../messaging/Message";
import { NotImplementedError } from "../../errors/notImplementedError";

export class IMediaRepository {
    public hasMedia(mediaId: number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}