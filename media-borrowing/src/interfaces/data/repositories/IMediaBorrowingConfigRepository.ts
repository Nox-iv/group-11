import { Message } from "../../messaging/Message";
import { NotImplementedError } from "../../errors/notImplementedError";

export class IMediaBorrowingConfigRepository {
    //@ts-ignore
    protected uow : IUnitOfWork

    constructor () {}

    public getRenewalLimit() : Promise<Message<number>> {
        throw new NotImplementedError()
    }
}