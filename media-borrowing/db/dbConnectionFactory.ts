import { Service } from "typedi"
import { Pool, PoolClient } from "pg"

@Service()
export class DbConnectionFactory {
    private dbConnectionPool : Pool

    constructor() {
        this.dbConnectionPool = new Pool({
            user: 'dbuser',
            password: 'secretpassword',
            host: 'database.server.com',
            port: 3211,
            database: 'mydb',
        })
          
    }

    async getDbConnection() : Promise<PoolClient>  {
        return await this.dbConnectionPool.connect()
    }
}