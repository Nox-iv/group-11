import { IDbContext } from "../../data/uow";
import { MediaBorrowingRecord } from "../../dto";
import { NotImplementedError } from "../../errors/notImplementedError";
import { Message } from "../../messaging/Message";

export class IMediaRenewalLogic {
    //@ts-ignore
    protected dbContext : IDbContext

    constructor () {}

    public renewMediaItem(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}