import { Message } from "../interfaces/messaging/Message";
import { MediaBorrowingRecord } from "../interfaces/dto";
import { IMediaBorrowingLogic } from "../interfaces/logic/IMediaBorrowingLogic";
import { InvalidBorrowingDateError } from "./errors/invalidBorrowingDateError";

export class MediaBorrowingLogic extends IMediaBorrowingLogic {
    constructor() {
        super()
    }

    public BorrowMediaItem(mediaBorrowingRecord : MediaBorrowingRecord) : Message<boolean> {
        const result = new Message(true)

        const earliestEndDate = this.getEarliestEndDate(mediaBorrowingRecord.startDate)
        if (mediaBorrowingRecord.endDate < earliestEndDate) {
            result.addError(new InvalidBorrowingDateError(`Earliest possible end date for the given start date is ${earliestEndDate}`))
        }

        if (result.hasErrors()) {
            result.value = false
        }

        return result
    }

    private getEarliestEndDate(startDate: Date) : Date {
        const earliestEndDate = new Date(startDate)
        earliestEndDate.setDate(earliestEndDate.getDate() + 1)
        earliestEndDate.setHours(0)
        earliestEndDate.setMinutes(0)
        earliestEndDate.setSeconds(0)

        return earliestEndDate
    }
}