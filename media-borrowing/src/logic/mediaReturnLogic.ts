import { Inject, Service } from 'typedi'
import { UserRepository, MediaBorrowingRepository } from '../data'
import { MediaBorrowingRecord } from '.'

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