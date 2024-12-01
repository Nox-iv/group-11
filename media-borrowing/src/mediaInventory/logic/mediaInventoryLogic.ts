import { Message } from "../../shared/messaging/Message"
import { IMediaInventoryLogic } from "../interfaces/logic/IMediaInventoryLogic"

export class MediaInventoryLogic extends IMediaInventoryLogic {
    constructor() {
        super()
    }

    public async isMediaItemAvailableAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        return new Message(true)
    }

    public async incrementMediaItemAvailabilityAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        return new Message(true)
    }

    public async decrementMediaItemAvailabilityAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        return new Message(true)
    }
}