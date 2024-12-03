import { Inject } from "typedi";
import { IMediaBorrowingReaderRepository } from "../../interfaces/data/repositories/IMediaBorrowingReaderRepository";
import { MediaBorrowingRecordDetails } from "../models/mediaBorrowingRecordDetails";
import { IDbConnectionFactory } from "../../../db/interfaces/connection/IDbConnectionFactory";

export class MediaBorrowingRecordReaderRepository extends IMediaBorrowingReaderRepository {
    constructor(@Inject() dbConnectionFactory : IDbConnectionFactory) {
        super()
        this.dbConnectionFactory = dbConnectionFactory
    }

    public async getMediaBorrowingRecordsByUserId(userId : number, offset : number, limit : number) : Promise<MediaBorrowingRecordDetails[] | null> {
        const conn = await this.dbConnectionFactory.create()

        const result = await conn.query<MediaBorrowingRecordDetails>(`
            SELECT 
                MediaBorrowingRecords.mediaBorrowingRecordId,
                MediaBorrowingRecords.startDate,
                MediaBorrowingRecords.endDate,
                MediaBorrowingRecords.renewals,
                Media.mediaId,
                Media.title,
                Media.assetUrl,
                Branches.branchId,
                Branches.name AS branchName,
                Location.name AS locationName
            FROM 
                MediaBorrowingRecords
            INNER JOIN 
                Media ON MediaBorrowingRecords.mediaId = Media.mediaId
            INNER JOIN 
                Branch ON MediaBorrowingRecords.branchId = Branches.branchId
            INNER JOIN
                Location ON Branches.locationId = Location.locationId
            INNER JOIN
            WHERE 
                userId = $1
            OFFSET $2
            LIMIT $3`, [userId, offset, limit])

        return result.length > 0 ? result : null
    }
}