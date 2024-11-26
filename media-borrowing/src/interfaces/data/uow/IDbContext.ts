import { NotImplementedError } from "../../errors/notImplementedError";
import { IMediaBorrowingRepository, IMediaRepository, IUserRepository } from "../repositories";

export class IDbContext {
    constructor() {}

    public getMediaBorrowingRepository() : Promise<IMediaBorrowingRepository> {
        throw new NotImplementedError()
    }

    public getUserRepository() : Promise<IUserRepository> {
        throw new NotImplementedError()
    }

    public getMediaRepository() : Promise<IMediaRepository> {
        throw new NotImplementedError()
    }

    public commit() : void {
        throw new NotImplementedError()
    }

    public rollback() : void {
        throw new NotImplementedError()
    }
}