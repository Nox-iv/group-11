import { IUnitOfWork } from "./IUnitOfWork";
import { NotImplementedError } from "../../errors/notImplementedError"

export class IUnitOfWorkFactory
{
    constructor() {}

    Create() : Promise<IUnitOfWork> {
        throw new NotImplementedError();
    }
}