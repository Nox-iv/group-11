import { IMediaBorrowingDateValidator } from "../../interfaces/logic/date-validator/IMediaBorrowingDateValidator"
import { Message } from "../../interfaces/messaging/Message"
import { InvalidBorrowingDateError } from "../errors"

export class MediaBorrowingDateValidator extends IMediaBorrowingDateValidator {
    constructor() {
        super()
    }

    public validateBorrowingDates(startDate : Date, endDate : Date) : Message<boolean> {
        const result = new Message(false)
        this.verifyDateRangeAgainstMinimumBorrowingDuration(startDate, endDate, result)

        if(!result.hasErrors()) {
            result.value = true
        }

        return result 
    }

    private verifyDateRangeAgainstMinimumBorrowingDuration(startDate : Date, endDate : Date, result : Message<boolean>) {
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
}