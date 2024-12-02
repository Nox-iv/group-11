import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { MediaBorrowingRecordDetails } from "../../data/models/mediaBorrowingRecordDetails";
import { Message } from "../../../shared/messaging/Message";
import { IMediaBorrowingReaderRepository } from "../data/repositories/IMediaBorrowingReaderRepository";

export class IMediaBorrowingReader {

    //@ts-ignore
    protected mediaBorrowingReaderRepository : IMediaBorrowingReaderRepository

    constructor() {}

    public getMediaBorrowingRecordsByUserId(userId : number, offset : number , limit : number) : Promise<Message<MediaBorrowingRecordDetails[]>> {
        throw new NotImplementedError()
    }
}