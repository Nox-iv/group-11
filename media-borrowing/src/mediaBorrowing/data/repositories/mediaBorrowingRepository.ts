import { IMediaBorrowingRepository } from "../../interfaces/data/repositories";
import { IUnitOfWork } from "../../../db/interfaces/uow";
import { MediaBorrowingRecord } from "../models";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { MediaBorrowingRecordEntity } from "../entities/mediaBorrowingRecordEntity";

export class MediaBorrowingRepository extends IMediaBorrowingRepository {
    private uow : IUnitOfWork
    
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async insertMediaBorrowingRecord(mediaBorrowingRecord: MediaBorrowingRecord): Promise<void> {
        const conn = this.uow.getTransaction().getConnection()

        await conn.command(
            `INSERT INTO MediaBorrowingRecords (
                userId, 
                mediaId, 
                branchId, 
                startDate, 
                endDate, 
                renewals
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                mediaBorrowingRecord.userId, 
                mediaBorrowingRecord.mediaId, 
                mediaBorrowingRecord.branchId, 
                mediaBorrowingRecord.startDate, 
                mediaBorrowingRecord.endDate, 
                mediaBorrowingRecord.renewals
            ]
        )
    }

    public async updateMediaBorrowingRecord(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<void> {
        const conn = this.uow.getTransaction().getConnection()

        await conn.command(
            `UPDATE MediaBorrowingRecords SET 
                userId = $1, 
                mediaId = $2, 
                branchId = $3, 
                startDate = $4, 
                endDate = $5, 
                renewals = $6
            WHERE mediaBorrowingRecordId = $7`,
            [
                mediaBorrowingRecord.userId,
                mediaBorrowingRecord.mediaId,
                mediaBorrowingRecord.branchId,
                mediaBorrowingRecord.startDate,
                mediaBorrowingRecord.endDate,
                mediaBorrowingRecord.renewals,
                mediaBorrowingRecord.mediaBorrowingRecordId
            ]
        )
    }

    public async hasMediaBorrowingRecord(userId : number, mediaId: number, branchId : number) : Promise<boolean> {
        const conn = this.uow.getTransaction().getConnection()

        const result = await conn.query<number>(`
            SELECT 1 
            FROM 
                MediaBorrowingRecords 
            WHERE 
                userId = $1 
                AND mediaId = $2 
                AND branchId = $3`, [userId, mediaId, branchId])

        return result.length > 0
    }

    public async archiveMediaBorrowingRecord(mediaBorrowingRecordId : number, returnedOn: Date) : Promise<void> {
        const conn = this.uow.getTransaction().getConnection()

        await conn.command(`
            WITH deletedMediaBorrowingRecord AS (
                DELETE FROM MediaBorrowingRecords
                WHERE mediaBorrowingRecordId = $1
                RETURNING *
            )
            INSERT INTO ArchivedMediaBorrowingRecords (
                mediaBorrowingRecordId,
                userId,
                mediaId, 
                branchId,
                startDate,
                endDate,
                returnedDate,
                renewals
            )
            SELECT 
                mediaBorrowingRecordId,
                userId,
                mediaId, 
                branchId,
                startDate,
                endDate,
                $2 as returnedDate,
                renewals
            FROM deletedMediaBorrowingRecord`, [mediaBorrowingRecordId, returnedOn])
    }

    public async getMediaBorrowingRecordById(mediaBorrowingRecordId : number) : Promise<MediaBorrowingRecord | null> {
        const conn = this.uow.getTransaction().getConnection()

        const result = await conn.query<MediaBorrowingRecordEntity>(`
            SELECT 
                MediaBorrowingRecords.*
            FROM 
                MediaBorrowingRecords 
            WHERE 
                mediaBorrowingRecordId = $1`, [mediaBorrowingRecordId])

        if (result.length === 0) {
            return null
        }

        const mediaBorrowingRecord = result[0]

        return {
            mediaBorrowingRecordId: mediaBorrowingRecord.mediaborrowingrecordid,
            userId: mediaBorrowingRecord.userid,
            mediaId: mediaBorrowingRecord.mediaid,
            branchId: mediaBorrowingRecord.branchid,
            startDate: mediaBorrowingRecord.startdate,
            endDate: mediaBorrowingRecord.enddate,
            renewals: mediaBorrowingRecord.renewals
        }
    }
} 