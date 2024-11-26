import { Inject } from "typedi";
import { IUnitOfWorkFactory, IUnitOfWork } from "../../interfaces/data/uow";
import { DbConnectionFactory } from "../connection"
import { UnitOfWork } from "./UnitOfWork";

export class UnitOfWorkFactory extends IUnitOfWorkFactory {
    private DbConnectionFactory : DbConnectionFactory

    constructor(@Inject() dbConnectionFactory : DbConnectionFactory) {
        super()
        this.DbConnectionFactory = dbConnectionFactory
    }

    public async Create() : Promise<IUnitOfWork> {
        const connection = await this.DbConnectionFactory.getDbConnection()
        const transaction = await connection.beginTransaction()
        return new UnitOfWork(transaction);
    }
}