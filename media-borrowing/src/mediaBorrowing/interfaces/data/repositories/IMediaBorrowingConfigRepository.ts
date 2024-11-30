import { Message } from "../../../../shared/messaging/Message";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";

export class IMediaBorrowingConfigRepository {
    //@ts-ignore
    protected uow : IUnitOfWork

    constructor () {}

    public getRenewalLimit() : Promise<Message<number>> {
        throw new NotImplementedError()
    }
}