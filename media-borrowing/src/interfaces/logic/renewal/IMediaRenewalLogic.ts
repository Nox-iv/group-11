import { IDbContext } from "../../data/uow";
import { MediaRenewalRequest } from "../../dto/MediaRenewalRequest";
import { NotImplementedError } from "../../errors/notImplementedError";
import { Message } from "../../messaging/Message";

export class IMediaRenewalLogic {
    //@ts-ignore
    protected dbContext : IDbContext

    constructor () {}

    public renewMediaItem(mediaRenewalRequest : MediaRenewalRequest) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}