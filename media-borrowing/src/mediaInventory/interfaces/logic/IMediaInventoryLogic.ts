import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { Message } from "../../../shared/messaging/Message";

export class IMediaInventoryLogic {
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