import { Inject, Service } from 'typedi'
import { MediaBorrowingRepository } from '../data'
import { MediaBorrowingRecord } from '.'

@Service()
export class MediaReturnLogic {
    constructor(
        @Inject() private mediaBorrowingRepository : MediaBorrowingRepository
    ) {}

    returnMediaItem(mediaBorrowingRecord: MediaBorrowingRecord) : void {
        this.mediaBorrowingRepository.deleteBorrowingRecord(
            mediaBorrowingRecord.userId, 
            mediaBorrowingRecord.mediaId, 
        )
    }
}