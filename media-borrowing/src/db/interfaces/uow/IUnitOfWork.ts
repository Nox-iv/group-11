import { IDbConnection, IDbTransaction } from "../connection"
import { NotImplementedError } from "../../../shared/errors/notImplementedError"

export class IUnitOfWork {

    //@ts-ignore
    protected transaction : IDbTransaction | null
    
    //@ts-ignore
    protected connection : IDbConnection

    constructor() {}

    public getTransaction() : IDbTransaction {
        throw new NotImplementedError()
    }

    public commit() : Promise<void> {
        throw new NotImplementedError()
    }

    public rollback() : Promise<void> {
        throw new NotImplementedError()
    }
}