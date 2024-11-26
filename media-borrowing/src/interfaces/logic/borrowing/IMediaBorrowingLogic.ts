import { Message } from "../../messaging/Message";
import { IDbContext } from "../../data/uow";
import { MediaBorrowingRecord } from "../../dto";
import { NotImplementedError } from "../../errors/notImplementedError";
import { IMediaBorrowingDateValidator } from "../date-validator/IMediaBorrowingDateValidator";

export class IMediaBorrowingLogic {
    //@ts-ignore
    protected dbContext : IDbContext

    //@ts-ignore
    protected mediaBorrowingDateValidator : IMediaBorrowingDateValidator

    constructor() {}

    public BorrowMediaItem(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }  
}