import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { IMediaBorrowingRepository } from "../../../mediaBorrowing/interfaces/data/repositories"
import { IMediaBorrowingConfigRepository } from "../../../mediaBorrowing/interfaces/data/repositories";
import { IMediaInventoryRepository } from "../../../mediaInventory/interfaces/data/repositories";
import { IBranchRepository } from "../../../amlBranches/interfaces/data/repositories";
import { IUserRepository } from "../../../amlUsers/interfaces/data/repositories/IUserRepository";
import { IUnitOfWork, IUnitOfWorkFactory } from "../uow";

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
    protected mediaInventoryRepository : IMediaInventoryRepository | null

    //@ts-ignore
    protected mediaBorrowingConfigRepository : IMediaBorrowingConfigRepository | null

    //@ts-ignore
    protected branchRepository : IBranchRepository | null

    constructor() {}

    public getMediaBorrowingRepository() : Promise<IMediaBorrowingRepository> {
        throw new NotImplementedError()
    }

    public getUserRepository() : Promise<IUserRepository> {
        throw new NotImplementedError()
    }

    public getMediaInventoryRepository() : Promise<IMediaInventoryRepository> {
        throw new NotImplementedError()
    }

    public getMediaBorrowingConfigRepository() : Promise<IMediaBorrowingConfigRepository> {
        throw new NotImplementedError()
    }

    public getBranchRepository() : Promise<IBranchRepository> {
        throw new NotImplementedError()
    }

    public commit() : Promise<void> {
        throw new NotImplementedError()
    }

    public rollback() : Promise<void> {
        throw new NotImplementedError()
    }

    public isClosed() : boolean {
        throw new NotImplementedError()
    }
}