import { IDbContext } from "../../../db/interfaces/dbContext";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { IMediaInventoryLogic } from "./IMediaInventoryLogic";

export class IMediaInventoryLogicFactory {
    constructor() {}

    public getMediaInventoryLogic (dbContext : IDbContext) : IMediaInventoryLogic {
        throw new NotImplementedError()
    }
}