import { Inject, Service } from 'typedi'
import { MediaBorrowingRecord } from "../types/mediaBorrowingRecord"
import { UserService } from '../services/user'

@Service()
export class MediaBorrowingLogic {
    constructor(@Inject() private userService : UserService) {}

    borrowMediaItem(userId: number, mediaItemId: number, startDate: Date, endDate: Date): MediaBorrowingRecord {
        if (endDate < startDate) {
            throw new Error('End date cannot be earlier than start date.')
        }
    
        if (!this.userService.isValidUserId(userId)) {
            throw new Error(`User ${userId} does not exist`)
        }
    
        return {
            userId: userId,
            mediaItemId: mediaItemId,
            startDate: startDate,
            endDate: endDate,
            renewals: 0
        } 
    }
}