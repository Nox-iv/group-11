import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { MediaBorrowingRecordListingDetails } from "../../data/models/mediaBorrowingRecordListingDetails";
import { Message } from "../../../shared/messaging/Message";
import { IMediaBorrowingReaderRepository } from "../data/repositories/IMediaBorrowingReaderRepository";

export class IMediaBorrowingReader {

    //@ts-ignore
    protected mediaBorrowingReaderRepository : IMediaBorrowingReaderRepository

    constructor() {}

    public getMediaBorrowingRecordsByUserId(userId : number, offset : number , limit : number) : Promise<Message<MediaBorrowingRecordListingDetails[]>> {
        throw new NotImplementedError()
    }
}