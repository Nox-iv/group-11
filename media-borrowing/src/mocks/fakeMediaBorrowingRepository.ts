import { Service } from "typedi";
import { MediaBorrowingRecord } from "../logic";
import { IMediaBorrowingRepository } from "../data";

@Service()
export class FakeMediaBorrowingRepository implements IMediaBorrowingRepository {
    public users: number[]
    public mediaItems: Map<number, number>
    public mediaBorrowingRecords : MediaBorrowingRecord[]

    constructor() {
        this.users = []
        this.mediaItems = new Map<number, number>()
        this.mediaBorrowingRecords = []
    }

    insertBorrowingRecord(userId: number, mediaId: number, startDate: Date, endDate: Date): void {
        const mediaBorrowingRecord : MediaBorrowingRecord = {
            userId,
            mediaId,
            startDate,
            endDate,
            renewals: 0
        }

        this.verifyUserExists(userId)
        this.verifyMediaItemExists(mediaId)

        for(let record of this.mediaBorrowingRecords) {
            if (record.userId == mediaBorrowingRecord.userId && record.mediaId == mediaBorrowingRecord.mediaId) {
                throw new Error(`User ${userId} cannot borrow multiple copies of media item ${mediaId}`)
            }
        }

        if (this.mediaItems.get(mediaId)! <= 0) {
            throw new Error(`Media item ${mediaId} is unavailable.`)
        }

        this.mediaBorrowingRecords.push(mediaBorrowingRecord)
        this.mediaItems.set(mediaId, this.mediaItems.get(mediaId)! - 1)
    }

    deleteBorrowingRecord(userId: number, mediaId: number): void {
        this.verifyMediaItemExists(mediaId)

        const idx = this.mediaBorrowingRecords.findIndex(x => x.mediaId == mediaId && x.userId == userId)

        if (idx == -1) {
            throw new Error(`Media borrowing record for user ${userId} and media item ${mediaId} does not exist.`)
        }

        this.mediaBorrowingRecords.splice(idx, 1)
        this.mediaItems.set(1, this.mediaItems.get(mediaId)! + 1)
    }

    extendBorrowingRecord(userId: number, mediaId: number, endDate: Date): void {
        const idx = this.mediaBorrowingRecords.findIndex(x => x.userId == userId && x.mediaId == mediaId)

        if (idx == -1) {
            throw new Error(`Media borrowing record for user ${userId} and media item ${mediaId} does not exist.`)
        }
        
        const record = this.mediaBorrowingRecords[idx]
        record.endDate = endDate
        record.renewals += 1
    }

    getBorrowingRecordsByUserId(userId: number) : MediaBorrowingRecord[] {
        return this.mediaBorrowingRecords.filter(x => x.userId == userId)
    }

    verifyMediaItemExists(mediaId: number): void {
        if (!this.mediaItems.has(mediaId)) {
            throw new Error(`Media item ${mediaId} does not exist.`)
        }
    }

    verifyUserExists(userId: number): void {
        if (this.users.findIndex(id => id == userId) == -1) {
            throw new Error(`User ${userId} does not exist.`)
        }
    }
} 