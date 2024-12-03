import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { Message } from "../../../shared/messaging/Message";
import { IDbContextFactory } from "../../../db/interfaces/dbContext/IDbContextFactory";

export class IMediaInventoryLogic {
    
    //@ts-ignore 
    protected dbContextFactory : IDbContextFactory

    constructor() {}

    public isMediaItemAvailableAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public incrementMediaItemAvailabilityAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public decrementMediaItemAvailabilityAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}