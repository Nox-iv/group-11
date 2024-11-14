import { Inject, Service } from 'typedi'
import { UserRepository } from '../data/user'
import { MediaBorrowingRepository } from '../data/borrowing'
import { MediaBorrowingRecord } from './types/mediaBorrowingRecord'

@Service()
export class MediaBorrowingLogic {
    constructor(
        @Inject() private userRepository : UserRepository,
        @Inject() private mediaBorrowingRepository : MediaBorrowingRepository
    ) {}

    borrowMediaItem(mediaBorrowingRecord: MediaBorrowingRecord) : void {
        if (mediaBorrowingRecord.endDate < mediaBorrowingRecord.startDate) {
            throw new Error('End date cannot be earlier than start date.')
        }
    
        if (!this.userRepository.isValidUserId(mediaBorrowingRecord.userId)) {
            throw new Error(`User ${mediaBorrowingRecord.userId} does not exist`)
        }

        this.mediaBorrowingRepository.insertBorrowingRecord(
            mediaBorrowingRecord.userId, 
            mediaBorrowingRecord.mediaId, 
            mediaBorrowingRecord.startDate, 
            mediaBorrowingRecord.endDate
        )
    }
}