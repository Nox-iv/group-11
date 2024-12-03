import { IDbTransaction, IDbConnection} from "../interfaces/connection"

export class DbTransaction extends IDbTransaction {
    private connection : IDbConnection

    constructor(connection : IDbConnection) {
        super()
        this.connection = connection
    }
       
    public getConnection() : IDbConnection {
        return this.connection
    }

    public async commit() : Promise<void> {
        try {
            await this.connection.query("COMMIT")
        } catch (e) {
            await this.rollback()
            throw e
        } 
    }

    public async rollback() : Promise<void> {
        try {
            await this.connection.query("ROLLBACK")
        } catch(e) {
            throw e
        } 
    }

}