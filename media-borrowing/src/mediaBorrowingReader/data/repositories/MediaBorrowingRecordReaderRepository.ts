import { IMediaBorrowingReaderRepository } from "../../interfaces/data/repositories/IMediaBorrowingReaderRepository";
import { MediaBorrowingRecordListingDetails } from "../models/mediaBorrowingRecordListingDetails";
import { IDbConnectionFactory } from "../../../db/interfaces/connection/IDbConnectionFactory";
import { MediaBorrowingRecordListingDetailsEntity } from "../entities/mediaBorrowingRecordListingDetailsEntity";


export class MediaBorrowingRecordReaderRepository extends IMediaBorrowingReaderRepository {
    constructor(dbConnectionFactory : IDbConnectionFactory) {
        super()
        this.dbConnectionFactory = dbConnectionFactory
    }

    public async getMediaBorrowingRecordsByUserId(userId : number, offset : number, limit : number) : Promise<MediaBorrowingRecordListingDetails[] | null> {
        const conn = await this.dbConnectionFactory.create()

        const results = await conn.query<MediaBorrowingRecordListingDetailsEntity>(`
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
                Branches.branchName
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
            ORDER BY
                MediaBorrowingRecords.startDate DESC
            OFFSET $2
            LIMIT $3`, [userId, offset, limit])
        
        return results.map(result => ({
            mediaBorrowingRecordId: result.mediaborrowingrecordid,
            startDate: result.startdate,
            endDate: result.enddate,
            renewals: result.renewals,
            mediaId: result.mediaid,
            mediaType: result.mediatype,
            title: result.title,
            author: result.author,
            assetUrl: result.asseturl,
            branchId: result.branchid,
            branchName: result.branchname
        }));
    }
}