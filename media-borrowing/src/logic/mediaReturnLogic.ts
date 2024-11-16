import { Inject, Service } from 'typedi'
import { UserRepository } from '../data/user'
import { MediaBorrowingRepository } from '../data/borrowing'
import { MediaBorrowingRecord } from './types/mediaBorrowingRecord'

@Service()
export class MediaReturnLogic {
    constructor(
        @Inject() private userRepository : UserRepository,
        @Inject() private mediaBorrowingRepository : MediaBorrowingRepository
    ) {}

    returnMediaItem(mediaBorrowingRecord: MediaBorrowingRecord) : void {
        this.mediaBorrowingRepository.deleteBorrowingRecord(
            mediaBorrowingRecord.userId, 
            mediaBorrowingRecord.mediaId, 
        )
    }
}