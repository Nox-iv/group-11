import { Container, Inject, Service } from 'typedi'
import { Message } from '../interfaces/messaging/Message'
import { MediaBorrowingRecord } from '../interfaces/dto'
import { MAX_BORROWING_PERIOD_DAYS, MAX_RENEWALS } from '../config'
import { InvalidBorrowingDateError, MaxBorrowingPeriodExceededError, MaxRenewalsExceededError, InvalidBorrowingRecordError, InvalidUserError } from '.'
import { IDbContext } from '../interfaces/data/uow'

@Service()
export class Logic {
    constructor(
        @Inject() private dbContext : IDbContext
    ) {}

    async borrowMediaItem(mediaBorrowingRecord: MediaBorrowingRecord) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            this.validateBorrowingDates(mediaBorrowingRecord.startDate, mediaBorrowingRecord.endDate, result)

            if (mediaBorrowingRecord.renewals > 0) {
                result.addError(new InvalidBorrowingRecordError('A new media borrowing record must have 0 renewals.'))
            }

            const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()

            if (mediaBorrowingRepository.hasUser(mediaBorrowingRecord.userId)) {
                result.addError(new InvalidUserError(`User ${mediaBorrowingRecord.userId} does not exist.`))
            }

            if (mediaBorrowingRepository.hasMediaItem(mediaBorrowingRecord.mediaId)) {
                result.addError(new InvalidUserError(`Media ${mediaBorrowingRecord.mediaId} does not exist.`))
            }

            const existingMediaBorrowingRecordResult = mediaBorrowingRepository.getBorrowingRecord(mediaBorrowingRecord.userId, mediaBorrowingRecord.mediaId)

            if (existingMediaBorrowingRecordResult.value) {
                result.addError(new InvalidBorrowingRecordError(`Borrowing record for user ${mediaBorrowingRecord.userId} and media ${mediaBorrowingRecord.mediaId} already exists.`))
            }

            if (result.hasErrors()) {
                throw new Error(`Media item ${mediaBorrowingRecord.mediaId} could not be borrowed by user ${mediaBorrowingRecord.userId}`)
            } 
                
            mediaBorrowingRepository.insertBorrowingRecord(
                mediaBorrowingRecord.userId, 
                mediaBorrowingRecord.mediaId, 
                mediaBorrowingRecord.startDate, 
                mediaBorrowingRecord.endDate
            )

            this.dbContext.commit()
            result.value = true
        } catch (e) {
            result.addError(e as Error)
            this.dbContext.rollback()
        } finally {
            return result
        }
    }

    validateBorrowingDates(startDate: Date, endDate: Date, result: Message<boolean>) {
        if (endDate < startDate) {
            result.addError(new InvalidBorrowingDateError('End date cannot be earlier than start date.'))
        }

        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() - 1);

        if (startDate < currentDate) {
            result.addError(new InvalidBorrowingDateError('Start date cannot be in the past.'))
        }

        const borrowingPeriodInDays = Math.floor((endDate.getTime() - startDate.getTime()) / 86400000)
        const maxBorrowingPeriodInDays = Container.get(MAX_BORROWING_PERIOD_DAYS)
        
        if (borrowingPeriodInDays > maxBorrowingPeriodInDays) {
            result.addError(new MaxBorrowingPeriodExceededError(`Max borrowing period is ${maxBorrowingPeriodInDays} calendar days.`))
        }
    }

    async renewBorrowedMediaItem(mediaBorrowingRecord: MediaBorrowingRecord, extensionInDays: number) : Promise<Message<boolean>> {
        const result = new Message(false)
        const userId = mediaBorrowingRecord.userId
        const mediaId = mediaBorrowingRecord.mediaId

        try {
            const extendedEndDate = new Date(mediaBorrowingRecord.endDate)
    
            const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()
            
            const existingRecordResult = mediaBorrowingRepository.getBorrowingRecord(mediaBorrowingRecord.userId, mediaBorrowingRecord.mediaId)

            if (existingRecordResult.value == null) {
                result.addError(new InvalidBorrowingRecordError(`Borrowing record for user ${userId} and media item ${mediaId} does not exist.`))
            } else {
                const extensionInDays = extendedEndDate.getDate() - existingRecordResult.value.endDate.getDate()
                this.validateRenewal(extensionInDays, mediaBorrowingRecord.renewals, result)
            }

            if (result.hasErrors()) {
                throw new Error(`Media borrowing record for user ${userId} and media item ${mediaId} cannot be renewed.`)
            }

            mediaBorrowingRepository.extendBorrowingRecord(mediaBorrowingRecord.userId, mediaBorrowingRecord.mediaId, extendedEndDate)
    
            this.dbContext.commit()
            result.value = true
        } catch(e) {
            result.addError(e as Error)
            this.dbContext.rollback()
        } finally {
            return result
        }
    }

    validateRenewal(extensionInDays: number, renewals:number, result: Message<boolean>) {
        if (extensionInDays > Container.get(MAX_BORROWING_PERIOD_DAYS)) {
            result.addError(new MaxBorrowingPeriodExceededError())
        }

        if (renewals >= Container.get(MAX_RENEWALS)) {
            result.addError(new MaxRenewalsExceededError())
        }

        return result
    }

    async returnMediaItem(mediaBorrowingRecord: MediaBorrowingRecord) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()
            const existingMediaBorrowingRecordResult = mediaBorrowingRepository.getBorrowingRecord(mediaBorrowingRecord.userId, mediaBorrowingRecord.mediaId)

            if (existingMediaBorrowingRecordResult.value) {
                result.addError(new InvalidBorrowingRecordError(`Borrowing record for user ${mediaBorrowingRecord.userId} and media ${mediaBorrowingRecord.mediaId} already exists.`))
            }

            if (result.hasErrors()) {
                throw new Error(`Media item ${mediaBorrowingRecord.mediaId} could not be returned by ${mediaBorrowingRecord.userId}.`)
            } 

            mediaBorrowingRepository.deleteBorrowingRecord(mediaBorrowingRecord.userId, mediaBorrowingRecord.mediaId)
            this.dbContext.commit()
        } catch(e) {
            result.addError(e as Error)
            this.dbContext.rollback()
        } finally {
            return result
        }
    }
}