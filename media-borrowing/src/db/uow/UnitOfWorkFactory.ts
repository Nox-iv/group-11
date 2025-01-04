import { IUnitOfWorkFactory, IUnitOfWork } from "../interfaces/uow";
import { IDbConnectionFactory } from "../interfaces/connection/IDbConnectionFactory";
import { UnitOfWork } from "./UnitOfWork";

export class UnitOfWorkFactory extends IUnitOfWorkFactory {
    constructor(dbConnectionFactory : IDbConnectionFactory) {
        super()
        this.dbConnectionFactory = dbConnectionFactory
    }

    public async Create() : Promise<IUnitOfWork> {
        const connection = await this.dbConnectionFactory.create()
        const transaction = await connection.beginTransaction()
        return new UnitOfWork(transaction);
    }
}