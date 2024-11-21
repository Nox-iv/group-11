import { UUID } from "crypto"

export type MediaBorrowingRecord = {
    userId: UUID,
    mediaId: UUID,
    startDate: Date,
    endDate: Date,
    renewals: number
}