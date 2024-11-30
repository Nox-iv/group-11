import { IDbTransaction, IDbConnection} from "../interfaces/connection"

export class DbTransaction extends IDbTransaction {
    private connection : IDbConnection

    constructor(connection : IDbConnection) {
        super()
        this.connection = connection
    }
       
    getConnection() : IDbConnection {
        return this.connection
    }

    async commit() : Promise<void> {
        try {
            await this.connection.query("COMMIT")
        } catch (e) {
            await this.rollback()
            throw e
        } 
    }

    async rollback() : Promise<void> {
        try {
            await this.connection.query("ROLLBACK")
        } catch(e) {
            throw e
        } 
    }

}