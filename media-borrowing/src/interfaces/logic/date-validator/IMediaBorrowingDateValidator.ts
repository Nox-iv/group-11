import { Message } from "../../messaging/Message";
import { NotImplementedError } from "../../errors/notImplementedError";

export class IMediaBorrowingDateValidator {
    constructor() {

    }

    public validateBorrowingDates(startDate : Date, endDate : Date) : Message<boolean> {
        throw new NotImplementedError()
        // Minimum borrowing period

        // Maximum borrowing period

        // Branch opening hours

        // Media Borrowing Configuration
        // Row for each branch 
        // ConfigID LocationID, MediaTypeID, MediaID, Max Renewals, Max Borrowing Length
        // TOP 1 from CTE to select most specific rule

        // Business Hours 
        // Days ENUM
        // 1 - Monday etc.
        // BranchID StartDayID EndDayID OpeningTime ClosingTime

        // Branch closures
        // BranchID Date
        // Special case closures for specific branch

        // Public closures
        // ID StartDate EndDate
        // Business-wide closures i.e. public holidays 
    }
}