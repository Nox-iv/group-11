import { Message } from "../../../../shared/messaging/Message";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { IDbContextFactory } from "../../../../db/interfaces/dbContext/IDbContextFactory";
import { BorrowingDateValidationRequest } from "../../../logic/mediaBorrowingDateValidation";

export class IMediaBorrowingDateValidator {
    //@ts-ignore
    protected dbContextFactory : IDbContextFactory

    constructor() {
    }

    public validateBorrowingDates(dateValiationRequest : BorrowingDateValidationRequest) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}