import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { Message } from "../../../../shared/messaging/Message";
import { MediaBorrowingRecordDetails } from "../../../data/models/mediaBorrowingRecordDetails";

export class IMediaBorrowingReaderRepository {
    constructor() {}

    public getMediaBorrowingRecordsByUserId(userId : number, offset : number, limit : number) : Promise<MediaBorrowingRecordDetails[] | null> {
        throw new NotImplementedError()
    }
}