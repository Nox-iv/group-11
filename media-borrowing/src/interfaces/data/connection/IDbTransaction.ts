import { NotImplementedError } from "../../errors/notImplementedError";
import { IDbConnection } from "./IDbConnection";

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