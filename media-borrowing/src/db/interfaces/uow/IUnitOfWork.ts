import { IDbTransaction } from "../connection"
import { NotImplementedError } from "../../../shared/errors/notImplementedError"

export class IUnitOfWork {
    constructor() {}

    getTransaction() : IDbTransaction {
        throw new NotImplementedError()
    }

    commit() : void {
        throw new NotImplementedError()
    }

    rollback() : void {
        throw new NotImplementedError()
    }
}