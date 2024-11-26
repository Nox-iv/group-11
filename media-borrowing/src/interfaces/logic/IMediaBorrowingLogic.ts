import { Message } from "../messaging/Message";
import { MediaBorrowingRecord } from "../dto";
import { NotImplementedError } from "../errors/notImplementedError";

export class IMediaBorrowingLogic {
    constructor() {}

    public BorrowMediaItem(mediaBorrowingRecord : MediaBorrowingRecord) : Message<boolean> {
        throw new NotImplementedError()
    }  
}