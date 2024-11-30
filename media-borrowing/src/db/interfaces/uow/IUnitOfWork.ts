import { IDbTransaction } from "../connection"
import { NotImplementedError } from "../../../shared/errors/notImplementedError"

export class IUnitOfWork {
    constructor() {}

    getTransaction() : IDbTransaction | null {
        throw new NotImplementedError()
    }

    commit() : void {
        throw new NotImplementedError()
    }

    rollback() : void {
        throw new NotImplementedError()
    }
}