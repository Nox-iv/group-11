import { Inject } from "typedi";
import { IUnitOfWorkFactory, IUnitOfWork } from "../interfaces/uow";
import { IDbConnectionFactory } from "../interfaces/connection/IDbConnectionFactory";
import { UnitOfWork } from "./UnitOfWork";

export class UnitOfWorkFactory extends IUnitOfWorkFactory {
    constructor(@Inject() dbConnectionFactory : IDbConnectionFactory) {
        super()
        this.dbConnectionFactory = dbConnectionFactory
    }

    public async Create() : Promise<IUnitOfWork> {
        const connection = await this.dbConnectionFactory.getDbConnection()
        const transaction = await connection.beginTransaction()
        return new UnitOfWork(transaction);
    }
}