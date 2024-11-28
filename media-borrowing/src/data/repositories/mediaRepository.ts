import { IMediaRepository } from "../../interfaces/data/repositories";
import { IUnitOfWork } from "../../interfaces/data/uow";
import { MediaItem } from "../../interfaces/dto/MediaItem";
import { NotImplementedError } from "../../interfaces/errors/notImplementedError";
import { Message } from "../../interfaces/messaging/Message";

export class MediaRepository extends IMediaRepository {
    private uow : IUnitOfWork
    
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async branchHasMediaItem(mediaId: number, branchId: number): Promise<Message<boolean>> {
        const result = new Message(false)

        return new Promise(() => null)
    }

    public getByMediaAndBranchId(mediaId: number, branchId : number) : Promise<Message<MediaItem>> {
        throw new NotImplementedError()
    }
} 