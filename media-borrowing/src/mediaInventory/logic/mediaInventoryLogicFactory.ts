import { IDbContext } from "../../db/interfaces/dbContext";
import { IMediaInventoryLogic } from "../interfaces/logic/IMediaInventoryLogic";
import { MediaInventoryLogic } from "./mediaInventoryLogic";

export class MediaInventoryLogicFactory {
    constructor() {}

    public getMediaInventoryLogic (dbContext : IDbContext) : IMediaInventoryLogic {
        return new MediaInventoryLogic(dbContext)
    }
}