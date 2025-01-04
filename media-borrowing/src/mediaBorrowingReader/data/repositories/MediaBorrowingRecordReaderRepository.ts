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
                Branches.branchName,
                Branches.locationId,
                MediaBorrowingConfig.renewalLimit,
                MediaBorrowingConfig.maximumBorrowingDurationInDays,
                json_agg(
                    json_build_object(
                        'branchid', bh.branchId,
                        'dayofweek', bh.dayOfWeek,
                        'openingtime', bh.openingTime,
                        'closingtime', bh.closingTime
                    )
                ) AS openingHours
            FROM 
                MediaBorrowingRecords
            INNER JOIN 
                Media ON MediaBorrowingRecords.mediaId = Media.mediaId
            INNER JOIN 
                MediaTypes ON Media.mediaTypeId = MediaTypes.mediaTypeId
            INNER JOIN 
                Branches ON MediaBorrowingRecords.branchId = Branches.branchId
            INNER JOIN
                MediaBorrowingConfig ON Branches.mediaBorrowingConfigId = MediaBorrowingConfig.mediaBorrowingConfigId
            LEFT JOIN
                BranchOpeningHours bh ON Branches.branchId = bh.branchId
            WHERE 
                MediaBorrowingRecords.userId = $1
            GROUP BY
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
                Branches.locationId,
                MediaBorrowingConfig.renewalLimit,
                MediaBorrowingConfig.maximumBorrowingDurationInDays
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
            branch: {
                branchId: result.branchid,
                locationId: result.locationid,
                name: result.branchname,
                openingHours: result.openinghours.reduce((acc, openingHour) => {
                    acc[openingHour.dayofweek][1].push([openingHour.openingtime, openingHour.closingtime])
                    return acc
                }, [[0, []],[1, []],[2, []],[3, []],[4, []],[5, []],[6, []]] as [number, [number, number][]][]),
                borrowingConfig: {
                    maxRenewals: result.renewallimit,
                    maxBorrowingPeriod: result.maximumborrowingdurationindays
                }
            }
        }));
    }
}