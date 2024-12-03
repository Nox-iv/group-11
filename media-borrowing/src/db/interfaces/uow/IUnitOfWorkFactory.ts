import { IUnitOfWork } from "./IUnitOfWork";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { IDbConnectionFactory } from "../connection/IDbConnectionFactory";

export class IUnitOfWorkFactory
{
    //@ts-ignore
    protected dbConnectionFactory : IDbConnectionFactory
    
    constructor() {}

    public Create() : Promise<IUnitOfWork> {
        throw new NotImplementedError();
    }
}