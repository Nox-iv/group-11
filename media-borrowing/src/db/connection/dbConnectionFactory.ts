import { Pool } from "pg"
import { IDbConnection } from "../interfaces/connection"
import { DbConnection } from "./dbConnection"
import { IDbConnectionFactory } from "../interfaces/connection/IDbConnectionFactory"

export class DbConnectionFactory extends IDbConnectionFactory {
    constructor(pool : Pool) {
        super()
        this.dbConnectionPool = pool
    }

    public async create() : Promise<IDbConnection>  {
        return new DbConnection(await this.dbConnectionPool.connect())
    }
}