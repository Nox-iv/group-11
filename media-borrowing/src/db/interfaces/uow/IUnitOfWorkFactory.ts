import { IUnitOfWork } from "./IUnitOfWork";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";

export class IUnitOfWorkFactory
{
    constructor() {}

    Create() : Promise<IUnitOfWork> {
        throw new NotImplementedError();
    }
}