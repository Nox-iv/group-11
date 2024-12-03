import { Inject } from "typedi"
import { IUnitOfWorkFactory } from "../interfaces/uow"
import { IDbContext } from "../interfaces/dbContext"
import { IMediaBorrowingRepository, IMediaBorrowingConfigRepository } from  "../../mediaBorrowing/interfaces/data/repositories"
import { IMediaInventoryRepository } from "../../mediaInventory/interfaces/data/repositories"
import { IUserRepository } from "../../amlUsers/interfaces/data/repositories/IUserRepository"
import { MediaBorrowingRepository, MediaBorrowingConfigRepository } from "../../mediaBorrowing/data/repositories"
import { MediaInventoryRepository } from "../../mediaInventory/data/repositories"
import { UserRepository } from "../../amlUsers/data/repositories"


export class DbContext extends IDbContext {
    constructor(
        @Inject() unitOfWorkFactory : IUnitOfWorkFactory
    ) {
        super()
        this.unitOfWorkFactory = unitOfWorkFactory
        this.unitOfWork = null
        this.mediaBorrowingRepository = null
        this.userRepository = null
        this.mediaInventoryRepository = null
        this.mediaBorrowingConfigRepository = null
    }

    public async getMediaBorrowingRepository() : Promise<IMediaBorrowingRepository> {
        if (this.mediaBorrowingRepository == null) {
            this.mediaBorrowingRepository = new MediaBorrowingRepository(await this.getUnitOfWork())
        }

        return this.mediaBorrowingRepository
    }

    public async getUserRepository() : Promise<IUserRepository> {
        if (this.userRepository == null) {
            this.userRepository = new UserRepository(await this.getUnitOfWork())
        }

        return this.userRepository
    }

    public async getMediaInventoryRepository(): Promise<IMediaInventoryRepository> {
        if (this.mediaInventoryRepository == null) {
            this.mediaInventoryRepository = new MediaInventoryRepository(await this.getUnitOfWork())
        }

        return this.mediaInventoryRepository
    }

    public async getMediaBorrowingConfigRepository() : Promise<IMediaBorrowingConfigRepository> {
        if (this.mediaBorrowingConfigRepository == null) {
            this.mediaBorrowingConfigRepository = new MediaBorrowingConfigRepository(await this.getUnitOfWork())
        }

        return this.mediaBorrowingConfigRepository
    }

    public async commit() : Promise<void> {
        try
        {
            if (this.unitOfWork) {
                await this.unitOfWork.commit();
            }
        }
        finally
        {
            this.reset();
        }
    }

    public async rollback() : Promise<void> {
        try
        {
            if (this.unitOfWork) {
                await this.unitOfWork.rollback();
            }
        }
        finally
        {
            this.reset();
        }
    }

    public isClosed() : boolean {
        return this.unitOfWork == null
    }


    private async getUnitOfWork() {
        if (this.unitOfWork == null) {
            this.unitOfWork = await this.unitOfWorkFactory.Create()
        } 
        
        return this.unitOfWork
    }

    private reset() {
        this.unitOfWork = null
        this.mediaBorrowingRepository = null
        this.userRepository = null
        this.mediaInventoryRepository = null 
        this.mediaBorrowingConfigRepository = null
    }
}