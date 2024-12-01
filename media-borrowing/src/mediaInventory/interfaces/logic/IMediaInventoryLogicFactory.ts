import { IDbContext } from "../../../db/interfaces/dbContext";
import { IFactory } from "../../../shared/interfaces/IFactory";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { IMediaInventoryLogic } from "./IMediaInventoryLogic";

export class IMediaInventoryLogicFactory implements IFactory<IMediaInventoryLogic> {
    //@ts-ignore
    protected dbContext : IDbContext
    
    constructor() {}

    public create(): IMediaInventoryLogic {
        throw new NotImplementedError()
    }
}