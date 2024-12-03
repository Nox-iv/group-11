import { IDbConnection } from "./IDbConnection"
import { NotImplementedError } from "../../../shared/errors/notImplementedError"

export class IDbTransaction {
    constructor() {}

    public getConnection() : IDbConnection {
        throw new NotImplementedError()
    }

    public commit() : Promise<void> {
        throw new NotImplementedError()
    }

    public rollback() : Promise<void> {
        throw new NotImplementedError()
    }

}