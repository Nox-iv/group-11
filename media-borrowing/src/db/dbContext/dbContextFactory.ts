import { RequestContext } from "../../app/middleware/context/requestContext";
import { IDbContext } from "../interfaces/dbContext/IDbContext";
import { IDbContextFactory } from "../interfaces/dbContext/IDbContextFactory";

export class DbContextFactory extends IDbContextFactory {
    constructor() {
        super()
    }

    public async create() : Promise<IDbContext> {
        return RequestContext.dbContext
    }
}