import { IDbTransaction, IDbConnection } from "../interfaces/connection";
import { IUnitOfWork } from "../interfaces/uow";

export class UnitOfWork extends IUnitOfWork {
    private transaction : IDbTransaction | null
    private connection : IDbConnection

    constructor(transaction : IDbTransaction) {
        super()
        this.transaction = transaction
        this.connection = transaction.getConnection()
    }

    getTransaction() : IDbTransaction {
        if (this.transaction == null) {
            throw new Error("Transaction not found.")
        }

        return this.transaction
    }

    commit() : void {
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

    rollback() : void {
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