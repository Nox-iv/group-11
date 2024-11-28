import { IDbContext } from "../../data/uow";
import { NotImplementedError } from "../../errors/notImplementedError";
import { Message } from "../../messaging/Message";

export class IMediaReturnLogic {
    //@ts-ignore
    protected dbContext : IDbContext

    constructor() {}

    public returnMediaItem(mediaBorrowingRecordId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}