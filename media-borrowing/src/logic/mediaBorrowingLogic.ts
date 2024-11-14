import { Inject, Service } from 'typedi'
import { MediaBorrowingRecord } from "./types/mediaBorrowingRecord"
import { UserRepository } from '../data/user'
import { MediaInventoryRepository } from '../data/inventory'

@Service()
export class MediaBorrowingLogic {
    constructor(
        @Inject() private userRepository : UserRepository,
        @Inject() private mediaInventoryRepository : MediaInventoryRepository
    ) {}

    borrowMediaItem(userId: number, mediaItemId: number, startDate: Date, endDate: Date): MediaBorrowingRecord {
        if (endDate < startDate) {
            throw new Error('End date cannot be earlier than start date.')
        }
    
        if (!this.userRepository.isValidUserId(userId)) {
            throw new Error(`User ${userId} does not exist`)
        }

        this.mediaInventoryRepository.updateMediaAvailability(mediaItemId)
    
        return {
            userId: userId,
            mediaItemId: mediaItemId,
            startDate: startDate,
            endDate: endDate,
            renewals: 0
        } 
    }
}