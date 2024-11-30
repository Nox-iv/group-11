import { IDbConnection } from "./IDbConnection"
import { NotImplementedError } from "../../../shared/errors/notImplementedError"

export class IDbTransaction {
    constructor() {}

    getConnection() : IDbConnection {
        throw new NotImplementedError()
    }

    commit() : void {
        throw new NotImplementedError()
    }

    rollback() : void {
        throw new NotImplementedError()
    }

}