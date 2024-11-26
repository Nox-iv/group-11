import { IMediaRepository } from "../../interfaces/data/repositories";
import { IUnitOfWork } from "../../interfaces/data/uow";
import { Message } from "../../interfaces/messaging/Message";

export class MediaRepository extends IMediaRepository {
    private uow : IUnitOfWork
    
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async hasMedia(mediaId: number, branchId: number): Promise<Message<boolean>> {
        const result = new Message(false)

        return new Promise(() => null)
    }
} 