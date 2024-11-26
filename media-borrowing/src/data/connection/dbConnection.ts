import { PoolClient } from "pg"
import { IDbConnection, IDbTransaction } from "../../interfaces/data/connection"
import { Message } from "../../interfaces/messaging/Message"
import { DbTransaction } from "./dbTransaction"

export class DbConnection extends IDbConnection {
    private dbClient : PoolClient

    constructor(dbClient : PoolClient) {
      super()
      this.dbClient = dbClient
    }

    public async beginTransaction(): Promise<IDbTransaction> {
      await this.dbClient.query("BEGIN")
      return new DbTransaction(this as DbConnection)
    }

    public async query<T>(queryText: string, params: any[] = []) : Promise<T[]> {
      const res = await this.dbClient.query(queryText, params)
      return res.rows as T[]
    }

    public async command(commandText: string, params: any[] = []) : Promise<void> {
      await this.dbClient.query(commandText, params)
    }

    public close() {
      this.dbClient.release()
    }
}