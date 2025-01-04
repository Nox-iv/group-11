import { IAmlBranchReaderRepository } from "../../interfaces/data/repositories/IAmlBranchReaderRepository"
import { IDbConnectionFactory } from "../../../db/interfaces/connection/IDbConnectionFactory"
import { BranchReadModel } from "../models/BranchReadModel"
import { BranchReadModelEntity } from "../entities/BranchReadModelEntity"

export class AmlBranchReaderRepository extends IAmlBranchReaderRepository {
    constructor(dbConnectionFactory : IDbConnectionFactory) {
        super()
        this.dbConnectionFactory = dbConnectionFactory
    }

    public async getBranchesByLocationId(locationId: number) : Promise<BranchReadModel[] | null> {
        const conn = await this.dbConnectionFactory.create()

        const results = await conn.query<BranchReadModelEntity>(`
            SELECT 
                b.branchId,
                b.locationId,
                b.branchName,
                json_agg(
                    json_build_object(
                        'branchid', bh.branchId,
                        'dayofweek', bh.dayOfWeek,
                        'openingtime', bh.openingTime,
                        'closingtime', bh.closingTime
                    )
                ) AS openingHours,
                mbc.renewalLimit,
                mbc.maximumBorrowingDurationInDays
            FROM 
                Branches b
            LEFT JOIN
                BranchOpeningHours bh
            ON
                b.branchId = bh.branchId
            INNER JOIN
                MediaBorrowingConfig mbc
            ON
                b.mediaBorrowingConfigId = mbc.mediaBorrowingConfigId
            WHERE 
                b.locationId = $1
            GROUP BY
                b.branchId, b.locationId, b.branchName, mbc.renewalLimit, mbc.maximumBorrowingDurationInDays
            `, [locationId])

        if (results.length == 0) {
            return null
        }

        return results.map(result => {
            return {
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
        })
    }
}