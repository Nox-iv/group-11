import { IDbContext } from "../../db/interfaces/dbContext";
import { IMediaInventoryLogic } from "../interfaces/logic/IMediaInventoryLogic";
import { IMediaInventoryLogicFactory } from "../interfaces/logic/IMediaInventoryLogicFactory";
import { MediaInventoryLogic } from "./mediaInventoryLogic";

export class MediaInventoryLogicFactory extends IMediaInventoryLogicFactory {
    constructor(dbContext : IDbContext) {
        super()
        this.dbContext = dbContext
    }

    public create() : IMediaInventoryLogic {
        return new MediaInventoryLogic(this.dbContext)
    }
}