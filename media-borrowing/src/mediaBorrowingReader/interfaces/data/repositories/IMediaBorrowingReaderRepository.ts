import { IDbConnectionFactory } from "../../../../db/interfaces/connection/IDbConnectionFactory";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { MediaBorrowingRecordListingDetails } from "../../../data/models/mediaBorrowingRecordListingDetails";

export class IMediaBorrowingReaderRepository {
    //@ts-ignore
    protected dbConnectionFactory : IDbConnectionFactory

    constructor() {}

    public getMediaBorrowingRecordsByUserId(userId : number, offset : number, limit : number) : Promise<MediaBorrowingRecordListingDetails[] | null> {
        throw new NotImplementedError()
    }
}