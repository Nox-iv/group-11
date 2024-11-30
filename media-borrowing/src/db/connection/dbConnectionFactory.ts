import { Pool } from "pg"
import { IDbConnection } from "../interfaces/connection"
import { DbConnection } from "./dbConnection"

export class DbConnectionFactory {
    private dbConnectionPool : Pool

    constructor(pool : Pool) {
        this.dbConnectionPool = pool
    }

    async getDbConnection() : Promise<IDbConnection>  {
        return new DbConnection(await this.dbConnectionPool.connect())
    }
}