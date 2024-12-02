import { IMediaBorrowingRepository } from "../../interfaces/data/repositories";
import { IUnitOfWork } from "../../../db/interfaces/uow";
import { MediaBorrowingRecord } from "../models";
import { Message } from "../../../shared/messaging/Message";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { IDbConnection } from "../../../db/interfaces/connection";

export class MediaBorrowingRepository extends IMediaBorrowingRepository {
    private uow : IUnitOfWork
    
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async insertBorrowingRecord(mediaBorrowingRecord: MediaBorrowingRecord): Promise<void> {
        const conn = this.getConnection()

        await conn.command(
            `INSERT INTO media_borrowing_records (
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

    public async updateBorrowingRecord(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<void> {

    }

    public doesBorrowingRecordExist(userId : number, mediaId: number, branchId : number) : Promise<boolean> {
        throw new NotImplementedError()
    }

    public async archiveBorrowingRecord(mediaBorrowingRecordId : number) : Promise<void> {
        throw new NotImplementedError()
    }

    public getBorrowingRecordById(mediaBorrowingRecordId : number) : Promise<MediaBorrowingRecord | null> {
        throw new NotImplementedError()
    }

    private getConnection() : IDbConnection {
        const transaction = this.uow.getTransaction()

        if (transaction == null) { 
            throw new Error("Transaction committed.")
        } else {
            return transaction.getConnection()
        }
    }
} 