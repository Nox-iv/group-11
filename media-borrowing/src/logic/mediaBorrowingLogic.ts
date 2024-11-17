import { Container, Inject, Service } from 'typedi'
import { MAX_BORROWING_PERIOD_DAYS, MAX_RENEWALS } from '../config'
import { UserRepository, MediaBorrowingRepository } from '../data'
import { InvalidUserError, InvalidBorrowingDateError, MediaBorrowingRecord, MaxBorrowingPeriodExceededError, MaxRenewalsExceededError } from '.'

@Service()
export class MediaBorrowingLogic {
    constructor(
        @Inject() private userRepository : UserRepository,
        @Inject() private mediaBorrowingRepository : MediaBorrowingRepository
    ) {}

    borrowMediaItem(mediaBorrowingRecord: MediaBorrowingRecord) : void {
        if (mediaBorrowingRecord.endDate < mediaBorrowingRecord.startDate) {
            throw new InvalidBorrowingDateError('End date cannot be earlier than start date.')
        }
    
        if (!this.userRepository.isValidUserId(mediaBorrowingRecord.userId)) {
            throw new InvalidUserError(`User ${mediaBorrowingRecord.userId} does not exist`)
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