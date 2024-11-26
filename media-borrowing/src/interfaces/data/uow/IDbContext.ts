import { NotImplementedError } from "../../errors/notImplementedError";
import { IMediaBorrowingConfigRepository, IMediaBorrowingRepository, IMediaRepository, IUserRepository } from "../repositories";
import { IUnitOfWork } from "./IUnitOfWork";
import { IUnitOfWorkFactory } from "./IUnitOfWorkFactory";

export class IDbContext {
    //@ts-ignore 
    protected unitOfWork : IUnitOfWork | null

    //@ts-ignore 
    protected unitOfWorkFactory : IUnitOfWorkFactory

    //@ts-ignore 
    protected mediaBorrowingRepository : IMediaBorrowingRepository | null

    //@ts-ignore 
    protected userRepository : IUserRepository | null

    //@ts-ignore 
    protected mediaRepository : IMediaRepository | null

    //@ts-ignore
    protected mediaBorrowingConfigRepository : IMediaBorrowingConfigRepository | null

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

    public getMediaBorrowingConfigRepository() : Promise<IMediaBorrowingConfigRepository> {
        throw new NotImplementedError()
    }

    public commit() : void {
        throw new NotImplementedError()
    }

    public rollback() : void {
        throw new NotImplementedError()
    }
}