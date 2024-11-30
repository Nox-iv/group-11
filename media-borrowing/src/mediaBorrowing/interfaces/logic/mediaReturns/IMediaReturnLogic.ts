import { IDbContext } from "../../../../db/interfaces/dbContext";
import { Message } from "../../../../shared/messaging/Message";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";

export class IMediaReturnLogic {
    //@ts-ignore
    protected dbContext : IDbContext

    constructor() {}

    public returnMediaItem(mediaBorrowingRecordId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}