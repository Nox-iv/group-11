import { IMediaBorrowingRepository } from "../../interfaces/data/repositories";
import { IUnitOfWork } from "../../../db/interfaces/uow";
import { MediaBorrowingRecord } from "../models";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";

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

    public async archiveMediaBorrowingRecord(mediaBorrowingRecordId : number) : Promise<void> {
        const conn = this.uow.getTransaction().getConnection()

        await conn.command(`
            WITH deleted AS (
                DELETE FROM MediaBorrowingRecords
                WHERE mediaBorrowingRecordId = $1
                RETURNING *
            )
            INSERT INTO ArchivedMediaBorrowingRecords
            SELECT 
                mediaBorrowingRecordId,
                userId,
                mediaId, 
                branchId,
                startDate,
                endDate,
                renewals,
                CURRENT_TIMESTAMP as archivedAt
            FROM deleted`, [mediaBorrowingRecordId])
    }

    public async getMediaBorrowingRecordById(mediaBorrowingRecordId : number) : Promise<MediaBorrowingRecord | null> {
        const conn = this.uow.getTransaction().getConnection()

        const result = await conn.query<MediaBorrowingRecord>(`
            SELECT 
                MediaBorrowingRecords.*
            FROM 
                MediaBorrowingRecords 
            WHERE 
                mediaBorrowingRecordId = $1`, [mediaBorrowingRecordId])

        return result.length > 0 ? result[0] : null
    }
} 