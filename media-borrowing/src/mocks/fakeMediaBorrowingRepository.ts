import { Service } from "typedi";
import { MediaBorrowingRecord } from "../logic";
import { IMediaBorrowingRepository } from "../interfaces";
import { UUID } from "crypto";

@Service()
export class FakeMediaBorrowingRepository extends IMediaBorrowingRepository {
    public users: UUID[]
    public mediaItems: Map<UUID, number>
    public mediaBorrowingRecords : MediaBorrowingRecord[]

    constructor() {
        super()
        this.users = []
        this.mediaItems = new Map<UUID, number>()
        this.mediaBorrowingRecords = []
    }

    insertBorrowingRecord(userId: UUID, mediaId: UUID, startDate: Date, endDate: Date): void {
        const mediaBorrowingRecord : MediaBorrowingRecord = {
            userId,
            mediaId,
            startDate,
            endDate,
            renewals: 0
        }

        this.mediaBorrowingRecords.push(mediaBorrowingRecord)
        this.mediaItems.set(mediaId, this.mediaItems.get(mediaId)! - 1)
    }

    deleteBorrowingRecord(userId: UUID, mediaId: UUID): void {
        const idx = this.mediaBorrowingRecords.findIndex(x => x.mediaId == mediaId && x.userId == userId)

        this.mediaBorrowingRecords.splice(idx, 1)
        this.mediaItems.set(mediaId, this.mediaItems.get(mediaId)! + 1)
    }

    extendBorrowingRecord(userId: UUID, mediaId: UUID, endDate: Date): void {
        const idx = this.mediaBorrowingRecords.findIndex(x => x.userId == userId && x.mediaId == mediaId)
        
        const record = this.mediaBorrowingRecords[idx]
        record.endDate = endDate
        record.renewals += 1
    }

    getBorrowingRecordsByUserId(userId: UUID) : MediaBorrowingRecord[] {
        return this.mediaBorrowingRecords.filter(x => x.userId == userId)
    }

    hasMediaItem(mediaId: UUID): boolean {
        return this.mediaItems.has(mediaId)
    }

    hasUser(userId: UUID): boolean {
        return this.users.findIndex(x => x == userId) != -1
    }
} 