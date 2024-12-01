import { Message } from "../../../../shared/messaging/Message";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";

export class IMediaBorrowingConfigRepository {
    //@ts-ignore
    protected uow : IUnitOfWork

    constructor () {}

    public getRenewalLimit(branchId : number) : Promise<number | null> {
        throw new NotImplementedError()
    }

    public getMaximumBorrowingDurationInDays(branchId : number) : Promise<number | null> {
        throw new NotImplementedError()
    }
}