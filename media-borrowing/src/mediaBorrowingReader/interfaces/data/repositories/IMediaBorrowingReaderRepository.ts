import { IDbConnectionFactory } from "../../../../db/interfaces/connection/IDbConnectionFactory";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { MediaBorrowingRecordDetails } from "../../../data/models/mediaBorrowingRecordDetails";

export class IMediaBorrowingReaderRepository {
    //@ts-ignore
    protected dbConnectionFactory : IDbConnectionFactory

    constructor() {}

    public getMediaBorrowingRecordsByUserId(userId : number, offset : number, limit : number) : Promise<MediaBorrowingRecordDetails[] | null> {
        throw new NotImplementedError()
    }
}