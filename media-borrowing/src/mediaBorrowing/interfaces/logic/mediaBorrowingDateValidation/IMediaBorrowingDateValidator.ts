import { Message } from "../../../../shared/messaging/Message";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { IDbContext } from "../../../../db/interfaces/dbContext";
import { BorrowingDateValidationRequest } from "../../../logic/mediaBorrowingDateValidation";

export class IMediaBorrowingDateValidator {
    //@ts-ignore
    protected dbContext : IDbContext

    constructor() {
    }

    public validateBorrowingDates(dateValiationRequest : BorrowingDateValidationRequest) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}