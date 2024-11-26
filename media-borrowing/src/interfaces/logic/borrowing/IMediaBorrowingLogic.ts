import { Message } from "../../messaging/Message";
import { IDbContext } from "../../data/uow";
import { MediaBorrowingRecord } from "../../dto";
import { NotImplementedError } from "../../errors/notImplementedError";

export class IMediaBorrowingLogic {
    //@ts-ignore
    protected dbContext : IDbContext

    constructor() {}

    public BorrowMediaItem(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }  
}