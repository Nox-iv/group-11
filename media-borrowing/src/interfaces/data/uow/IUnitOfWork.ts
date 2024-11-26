import { NotImplementedError } from "../../errors/notImplementedError";
import { IDbTransaction } from "../connection";

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