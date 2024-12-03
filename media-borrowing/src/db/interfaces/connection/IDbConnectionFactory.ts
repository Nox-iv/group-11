import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { IDbConnection } from "./IDbConnection";

export class IDbConnectionFactory {

    //@ts-ignore
    protected dbConnectionPool : Pool

    public getDbConnection() : Promise<IDbConnection> {
        throw new NotImplementedError()
    }
}