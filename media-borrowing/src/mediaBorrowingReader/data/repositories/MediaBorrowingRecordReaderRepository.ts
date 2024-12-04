import { Inject } from "typedi";
import { IMediaBorrowingReaderRepository } from "../../interfaces/data/repositories/IMediaBorrowingReaderRepository";
import { MediaBorrowingRecordListingDetails } from "../models/mediaBorrowingRecordListingDetails";
import { IDbConnectionFactory } from "../../../db/interfaces/connection/IDbConnectionFactory";


export class MediaBorrowingRecordReaderRepository extends IMediaBorrowingReaderRepository {
    constructor(@Inject() dbConnectionFactory : IDbConnectionFactory) {
        super()
        this.dbConnectionFactory = dbConnectionFactory
    }

    public async getMediaBorrowingRecordsByUserId(userId : number, offset : number, limit : number) : Promise<MediaBorrowingRecordListingDetails[] | null> {
        const conn = await this.dbConnectionFactory.create()

        const mediaBorrowingDetails = await conn.query<MediaBorrowingRecordListingDetails>(`
            SELECT 
                MediaBorrowingRecords.mediaBorrowingRecordId,
                MediaBorrowingRecords.startDate,
                MediaBorrowingRecords.endDate,
                MediaBorrowingRecords.renewals,
                Media.mediaId,
                MediaTypes.mediaTypeName,
                Media.title,
                Media.author,
                Media.assetUrl,
                Branches.branchId,
                Branches.branchName,
            FROM 
                MediaBorrowingRecords
            INNER JOIN 
                Media ON MediaBorrowingRecords.mediaId = Media.mediaId
            INNER JOIN 
                MediaTypes ON Media.mediaTypeId = MediaTypes.mediaTypeId
            INNER JOIN 
                Branches ON MediaBorrowingRecords.branchId = Branches.branchId
            WHERE 
                MediaBorrowingRecords.userId = $1
            OFFSET $2
            LIMIT $3`, [userId, offset, limit])
        
        return mediaBorrowingDetails.length > 0 ? mediaBorrowingDetails : [] 
    }
}