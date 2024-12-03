import { IUnitOfWork } from "./IUnitOfWork";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";

export class IUnitOfWorkFactory
{
    //@ts-ignore
    protected dbConnectionFactory : DbConnectionFactory
    
    constructor() {}

    public Create() : Promise<IUnitOfWork> {
        throw new NotImplementedError();
    }
}