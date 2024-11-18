import { Service } from "typedi"
import { Pool, PoolClient } from "pg"

@Service()
export class DbConnectionFactory {
    private dbConnectionPool : Pool

    constructor() {
        // Connection info in env variables.
        this.dbConnectionPool = new Pool()
    }

    async getDbConnection() : Promise<PoolClient>  {
        return await this.dbConnectionPool.connect()
    }
}