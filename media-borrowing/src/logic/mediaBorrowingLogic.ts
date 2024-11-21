import { Container, Inject, Service } from 'typedi'
import { MAX_BORROWING_PERIOD_DAYS, MAX_RENEWALS } from '../config'
import { IMediaBorrowingRepository } from '../interfaces'
import { InvalidBorrowingDateError, MediaBorrowingRecord, MaxBorrowingPeriodExceededError, MaxRenewalsExceededError, InvalidBorrowingRecordError } from '.'
import { UUID } from 'crypto'

@Service()
export class MediaBorrowingLogic {
    constructor(
        @Inject() private mediaBorrowingRepository : IMediaBorrowingRepository
    ) {}

    borrowMediaItem(mediaBorrowingRecord: MediaBorrowingRecord) : void {
        if (mediaBorrowingRecord.endDate < mediaBorrowingRecord.startDate) {
            throw new InvalidBorrowingDateError('End date cannot be earlier than start date.')
        }

        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() - 1);

        if (mediaBorrowingRecord.startDate < currentDate) {
            throw new InvalidBorrowingDateError('Start date cannot be in the past.')
        }

        const borrowingPeriodInDays = Math.floor((mediaBorrowingRecord.endDate.getTime() - mediaBorrowingRecord.startDate.getTime()) / 86400000)
        const maxBorrowingPeriodInDays = Container.get(MAX_BORROWING_PERIOD_DAYS)
        
        if (borrowingPeriodInDays > maxBorrowingPeriodInDays) {
            throw new MaxBorrowingPeriodExceededError(`Max borrowing period is ${maxBorrowingPeriodInDays} calendar days.`)
        }

        if (mediaBorrowingRecord.renewals > 0) {
            throw new InvalidBorrowingRecordError('A new media borrowing record must have 0 renewals.')
        }

        if (!this.mediaBorrowingRepository.hasUser(mediaBorrowingRecord.userId)) {
            throw new Error()
        }

        if (!this.mediaBorrowingRepository.hasMediaItem(mediaBorrowingRecord.mediaId)) {
            throw new Error()
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

    getBorrowingRecordsByUserId(userId: UUID) {
        return this.mediaBorrowingRepository.getBorrowingRecordsByUserId(userId)
    }
}