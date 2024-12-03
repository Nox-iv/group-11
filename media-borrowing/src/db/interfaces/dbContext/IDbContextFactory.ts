import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { IDbContext } from "./IDbContext";

export class IDbContextFactory {
    public create() : Promise<IDbContext> {
        throw new NotImplementedError()
    }
}