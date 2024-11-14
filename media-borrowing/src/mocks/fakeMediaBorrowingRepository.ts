import { Service } from "typedi";
import { MediaBorrowingRecord } from "../logic";
import { MediaBorrowingRepository } from "../data/borrowing";

@Service()
export class FakeMediaBorrowingRepository extends MediaBorrowingRepository{
    public mediaItems: Map<number, number>
    public mediaBorrowingRecords : MediaBorrowingRecord[]

    constructor() {
        super()
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

        if (!this.mediaItems.has(mediaId)) {
            throw new Error(`Media item ${mediaId} does not exist.`)
        }

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
} 