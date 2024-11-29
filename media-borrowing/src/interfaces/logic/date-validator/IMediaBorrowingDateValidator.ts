import { Message } from "../../messaging/Message";
import { NotImplementedError } from "../../errors/notImplementedError";
import { IDbContext } from "../../data/uow";
import { BorrowingDateValidationRequest } from "../../dto/BorrowingDateValidationRequest";

export class IMediaBorrowingDateValidator {
    //@ts-ignore
    protected dbContext : IDbContext

    constructor() {
    }

    public validateBorrowingDates(dateValiationRequest : BorrowingDateValidationRequest) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}