import { Container, Inject, Service } from 'typedi'
import { MAX_BORROWING_PERIOD_DAYS, MAX_RENEWALS } from '../config'
import { MediaBorrowingRepository } from '../data'
import { InvalidUserError, InvalidBorrowingDateError, MediaBorrowingRecord, MaxBorrowingPeriodExceededError, MaxRenewalsExceededError } from '.'

@Service()
export class MediaBorrowingLogic {
    constructor(
        @Inject() private mediaBorrowingRepository : MediaBorrowingRepository
    ) {}

    borrowMediaItem(mediaBorrowingRecord: MediaBorrowingRecord) : void {
        if (mediaBorrowingRecord.endDate < mediaBorrowingRecord.startDate) {
            throw new InvalidBorrowingDateError('End date cannot be earlier than start date.')
        }

        this.mediaBorrowingRepository.insertBorrowingRecord(
            mediaBorrowingRecord.userId, 
            mediaBorrowingRecord.mediaId, 
            mediaBorrowingRecord.startDate, 
            mediaBorrowingRecord.endDate
        )
    }

    renewBorrowedMediaItem(mediaBorrowingRecord: MediaBorrowingRecord, extensionInDays: number) : void {
        if (extensionInDays > Container.get(MAX_BORROWING_PERIOD_DAYS)) {
            throw new MaxBorrowingPeriodExceededError()
        }

        if (mediaBorrowingRecord.renewals >= Container.get(MAX_RENEWALS)) {
            throw new MaxRenewalsExceededError()
        }

        const extendedEndDate = new Date(mediaBorrowingRecord.endDate)
        extendedEndDate.setDate(extendedEndDate.getDate() + 14)
        
        this.mediaBorrowingRepository.extendBorrowingRecord(mediaBorrowingRecord.userId, mediaBorrowingRecord.mediaId, extendedEndDate)
    }

    returnMediaItem(mediaBorrowingRecord: MediaBorrowingRecord) : void {
        this.mediaBorrowingRepository.deleteBorrowingRecord(
            mediaBorrowingRecord.userId, 
            mediaBorrowingRecord.mediaId, 
        )
    }
}