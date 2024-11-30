import { Inject } from 'typedi'
import { IMediaBorrowingDateValidator } from '../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator'
import { Message } from '../../../shared/messaging/Message'
import { InvalidBorrowingDateError, BorrowingDateValidationRequest} from "."
import { BranchOpeningHours } from '../../data/models'
import { IDbContext } from '../../../db/interfaces/dbContext'
import { MaxBorrowingPeriodExceededError } from '../mediaBorrowingConfig'

export class MediaBorrowingDateValidator extends IMediaBorrowingDateValidator {
    constructor(@Inject() dbContext : IDbContext) {
        super()
        this.dbContext = dbContext
    }

    public async validateBorrowingDates(borrowingDateValidationRequest : BorrowingDateValidationRequest) : Promise<Message<boolean>> {
        const result = new Message(false)
        const {startDate, endDate, branchId} = borrowingDateValidationRequest

        this.validateDateRangeAgainstMinimumBorrowingDuration(startDate, endDate, result)
        await this.validateDateRangeAgainstBranchOpeningHours(startDate, endDate, branchId, result)
        await this.validateBorrowingDurationAgainstMaximum(borrowingDateValidationRequest, result)

        if(!result.hasErrors()) {
            result.value = true
            this.dbContext.commit()
        } else {
            this.dbContext.rollback()
        }

        return result 
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

    private async validateDateRangeAgainstBranchOpeningHours(startDate : Date, endDate : Date, branchId : number, result : Message<boolean>) {
        const branchRepository = await this.dbContext.getBranchRepository()
        const branchOpeningHoursResult = await branchRepository.getOpeningHoursById(branchId)

        if (branchOpeningHoursResult.value != null) {
            if (!this.dateIsWithinOpeningHours(startDate, branchOpeningHoursResult.value)) {
                result.addError(new InvalidBorrowingDateError(`Invalid start date/time : start time must be within branch ${branchId}'s opening hours.`))
            }

            if (!this.dateIsWithinOpeningHours(endDate, branchOpeningHoursResult.value)) {
                result.addError(new InvalidBorrowingDateError(`Invalid end date/time : end time must be within branch ${branchId}'s opening hours.`))
            }
        } else if (branchOpeningHoursResult.hasErrors()) {
            result.addErrorsFromMessage(branchOpeningHoursResult)
        } else {
            result.addError(new Error(`Could not find opening hours for branch ${branchId}`))
        }
    }

    private dateIsWithinOpeningHours(date : Date, openingHours: BranchOpeningHours) : boolean {
        const dayOfWeek = date.getDay()
        const [openingHour, closingHour] = openingHours[dayOfWeek]
        const hoursIn24hFormat = this.getHoursIn24hFormat(date)
        return openingHour <= hoursIn24hFormat && hoursIn24hFormat <= closingHour
    }

    private getHoursIn24hFormat(date : Date) : number {
        return (date.getHours() * 100) + date.getMinutes() 
    }

    private async validateBorrowingDurationAgainstMaximum(borrowingDateValidationRequest : BorrowingDateValidationRequest, result : Message<boolean>) {
        const { startDate, endDate, branchId } = borrowingDateValidationRequest
        const mediaBorrowingConfigRepository = await this.dbContext.getMediaBorrowingConfigRepository()
        const maxDurationResult = await mediaBorrowingConfigRepository.getMaximumBorrowingDurationInDays(branchId)

        if (maxDurationResult.hasErrors()) {
            result.addErrorsFromMessage(maxDurationResult)
        } else if (maxDurationResult.value == null) {
            result.addError(new Error(`Could not find max borrowing duration for branch ${branchId}`))
        } else if (this.getDifferenceInDays(startDate, endDate) > maxDurationResult.value) {
            result.addError(new MaxBorrowingPeriodExceededError(`Max borrowing duration at branch ${branchId} is ${maxDurationResult.value} days.`))
        }
    }

    private getDifferenceInDays(startDate : Date, endDate : Date) : number {
        const timeDifference = Math.abs(startDate.getTime() - endDate.getTime());
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        return daysDifference;
    }
}