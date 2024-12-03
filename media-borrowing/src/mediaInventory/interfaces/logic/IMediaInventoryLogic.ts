import { DbContextFactory } from "../../../db/dbContext/dbContextFactory";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { Message } from "../../../shared/messaging/Message";

export class IMediaInventoryLogic {
    
    //@ts-ignore 
    protected dbContextFactory : DbContextFactory

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