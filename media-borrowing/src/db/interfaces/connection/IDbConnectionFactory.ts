import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { IDbConnection } from "./IDbConnection";

export class IDbConnectionFactory {

    //@ts-ignore
    protected dbConnectionPool : Pool

    public create() : Promise<IDbConnection> {
        throw new NotImplementedError()
    }
}