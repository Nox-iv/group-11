import { IMediaBorrowingDateValidator } from '../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator'
import { Message } from '../../../shared/messaging/Message'
import { InvalidBorrowingDateError, BorrowingDateValidationRequest} from "."
import { BranchOpeningHours } from '../../data/models'
import { MaxBorrowingPeriodExceededError } from '../mediaBorrowingConfig'
import { IDbContextFactory } from '../../../db/interfaces/dbContext/IDbContextFactory'
import { IDbContext } from '../../../db/interfaces/dbContext'

export class MediaBorrowingDateValidator extends IMediaBorrowingDateValidator {
    constructor(dbContextFactory : IDbContextFactory) {
        super()
        this.dbContextFactory = dbContextFactory
    }

    public async validateBorrowingDates(borrowingDateValidationRequest : BorrowingDateValidationRequest) : Promise<Message<boolean>> {
        const result = new Message(false)
        const dbContext = await this.dbContextFactory.create()
        const {startDate, endDate, branchId} = borrowingDateValidationRequest

        try {
            this.validateDateRangeAgainstMinimumBorrowingDuration(startDate, endDate, result)
            await this.validateDateRangeAgainstBranchOpeningHours(startDate, endDate, branchId, dbContext, result)
            await this.validateBorrowingDurationAgainstMaximum(borrowingDateValidationRequest, dbContext, result)

            if(!result.hasErrors()) {
                result.value = true
            } 
        } catch(e) {
            result.addError(e as Error)
        } finally {
            return result
        }
    }

    private validateDateRangeAgainstMinimumBorrowingDuration(startDate : Date, endDate : Date, result : Message<boolean>) {
        const earliestEndDate = this.getEarliestEndDate(startDate)
        if (endDate < earliestEndDate) {
            result.addError(new InvalidBorrowingDateError(`Earliest possible end date for the given start date is ${earliestEndDate}`))
        }
    }

    private getEarliestEndDate(startDate: Date) : Date {
        const earliestEndDate = new Date(startDate)
        earliestEndDate.setDate(earliestEndDate.getDate() + 1)

        return earliestEndDate
    }

    private async validateDateRangeAgainstBranchOpeningHours(startDate : Date, endDate : Date, branchId : number, dbContext : IDbContext, result : Message<boolean>) {
        const branchRepository = await dbContext.getBranchRepository()
        const branchOpeningHours = await branchRepository.getOpeningHoursById(branchId)

        if (branchOpeningHours == null) {
            result.addError(new Error(`Could not find opening hours for branch ${branchId}`))
        } else {
            if (!this.dateIsWithinOpeningHours(startDate, branchOpeningHours)) {
                result.addError(new InvalidBorrowingDateError(`Invalid start date/time : start time must be within branch ${branchId}'s opening hours.`))
            }

            if (!this.dateIsWithinOpeningHours(endDate, branchOpeningHours)) {
                result.addError(new InvalidBorrowingDateError(`Invalid end date/time : end time must be within branch ${branchId}'s opening hours.`))
            }
        } 
    }

    private dateIsWithinOpeningHours(date : Date, branchOpeningHours: BranchOpeningHours) : boolean {
        const dayOfWeek = date.getDay()
        const dayOfWeekOpeningHours = branchOpeningHours.getOpeningHoursForDay(dayOfWeek)
        const hoursIn24hFormat = this.getTimeIn24hFormat(date)

        return dayOfWeekOpeningHours.some(([openingHour, closingHour]) => {
            return openingHour <= hoursIn24hFormat && hoursIn24hFormat <= closingHour
        })
    }

    private getTimeIn24hFormat(date : Date) : number {
        return (date.getHours() * 100) + date.getMinutes() 
    }

    private async validateBorrowingDurationAgainstMaximum(borrowingDateValidationRequest : BorrowingDateValidationRequest, dbContext : IDbContext, result : Message<boolean>) {
        const { startDate, endDate, branchId } = borrowingDateValidationRequest
        const mediaBorrowingConfigRepository = await dbContext.getMediaBorrowingConfigRepository()
        const maxDuration = await mediaBorrowingConfigRepository.getMaximumBorrowingDurationInDays(branchId)

        if (maxDuration == null) {
            result.addError(new Error(`Could not find max borrowing duration for branch ${branchId}`))
        } else if (this.getDifferenceInDays(startDate, endDate) > maxDuration) {
            result.addError(new MaxBorrowingPeriodExceededError(`Max borrowing duration at branch ${branchId} is ${maxDuration} days.`))
        }
    }

    private getDifferenceInDays(startDate : Date, endDate : Date) : number {
        const timeDifference = Math.abs(startDate.getTime() - endDate.getTime());
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        return daysDifference;
    }
}