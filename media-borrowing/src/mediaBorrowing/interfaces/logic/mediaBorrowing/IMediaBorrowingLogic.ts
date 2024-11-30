import { Message } from "../../../../shared/messaging/Message";
import { IDbContext } from "../../../../db/interfaces/dbContext";
import { MediaBorrowingRecord } from "../../../data/models";
import { IMediaBorrowingDateValidator } from "../mediaBorrowingDateValidation/IMediaBorrowingDateValidator";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";

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