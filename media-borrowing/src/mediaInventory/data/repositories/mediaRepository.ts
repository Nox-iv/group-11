import { IMediaRepository } from "../../interfaces/data/repositories";
import { IUnitOfWork } from "../../../db/interfaces/uow";
import { MediaItem } from "../models";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { Message } from "../../../shared/messaging/Message";

export class MediaRepository extends IMediaRepository {
    private uow : IUnitOfWork
    
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public getItemByMediaAndBranchId(mediaId: number, branchId : number) : Promise<MediaItem | null> {
        throw new NotImplementedError()
    }
} 