import { IDbContext } from "../../../../db/interfaces/dbContext";
import { Message } from "../../../../shared/messaging/Message";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { IMediaInventoryLogic } from "../../../../mediaInventory/interfaces/logic/IMediaInventoryLogic";

export class IMediaReturnLogic {
    //@ts-ignore
    protected dbContext : IDbContext

    //@ts-ignore
    protected mediaInventoryLogic : IMediaInventoryLogic

    constructor() {}

    public returnMediaItem(mediaBorrowingRecordId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}