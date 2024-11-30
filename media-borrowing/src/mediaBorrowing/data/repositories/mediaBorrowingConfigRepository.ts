import { Inject } from "typedi"
import { Message } from "../../../shared/messaging/Message"
import { IUnitOfWork } from "../../../db/interfaces/uow"
import { IMediaBorrowingConfigRepository } from "../../interfaces/data/repositories"

export class MediaBorrowingConfigRepository extends IMediaBorrowingConfigRepository {
    constructor(@Inject() uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async getRenewalLimit() : Promise<Message<number>> {
        const result = new Message(false)

        return new Promise(() => null)
    }
}