import { IDbTransaction } from "../interfaces/connection";
import { IUnitOfWork } from "../interfaces/uow";

export class UnitOfWork extends IUnitOfWork {
    constructor(transaction : IDbTransaction) {
        super()
        this.transaction = transaction
        this.connection = transaction.getConnection()
    }

    public getTransaction() : IDbTransaction {
        if (this.transaction == null) {
            throw new Error("Transaction not found.")
        }

        return this.transaction
    }

    public async commit() : Promise<void> {
        try {
            this.transaction?.commit()
        } catch (e) {
            this.transaction?.rollback()
            throw e
        } finally {
            this.connection.close()
            this.transaction = null
        }
    }

    public async rollback() : Promise<void> {
        try {
            this.transaction?.rollback()
        } catch (e) {
            throw e
        } finally {
            this.connection.close()
            this.transaction = null
        }
    }
}