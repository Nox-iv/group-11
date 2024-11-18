import { Service, Inject } from "typedi";
import { DbConnectionFactory } from "./dbConnectionFactory";

@Service()
export class DbConnection {
    private dbConnectionFactory : DbConnectionFactory

    constructor(@Inject() dbConnectionFactory: DbConnectionFactory) {
      this.dbConnectionFactory = dbConnectionFactory
    }

    public async query(queryText: string, params: any[]) {
      const client = await this.dbConnectionFactory.getDbConnection()
      try {
        await client.query(queryText, params)
      } catch (e) {
        console.log('Connection failed.')
        throw e
      } finally {
        client.release()
      }
    }
}