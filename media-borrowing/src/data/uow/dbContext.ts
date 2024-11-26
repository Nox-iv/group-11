import { Inject } from "typedi"
import { IUnitOfWorkFactory, IUnitOfWork, IDbContext } from "../../interfaces/data/uow"
import { IMediaBorrowingRepository, IMediaRepository, IUserRepository } from "../../interfaces/data/repositories"
import { MediaBorrowingRepository } from "../../data"
import { UserRepository } from "../repositories/userRepository"
import { MediaRepository } from "../repositories/mediaRepository"

export class DbContext extends IDbContext {
    private unitOfWork : IUnitOfWork | null
    private unitOfWorkFactory : IUnitOfWorkFactory
    private mediaBorrowingRepository : IMediaBorrowingRepository | null
    private userRepository : IUserRepository | null
    private mediaRepository : IMediaRepository | null

    constructor(
        @Inject() unitOfWorkFactory : IUnitOfWorkFactory
    ) {
        super()
        this.unitOfWorkFactory = unitOfWorkFactory
        this.unitOfWork = null
        this.mediaBorrowingRepository = null
        this.userRepository = null
        this.mediaRepository = null
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

    public async getMediaRepository(): Promise<IMediaRepository> {
        if (this.mediaRepository == null) {
            this.mediaRepository = new MediaRepository(await this.getUnitOfWork())
        }

        return this.mediaRepository
    }

    public commit() : void {
        try
        {
            if (this.unitOfWork) {
                this.unitOfWork.commit();
            }
        }
        finally
        {
            this.reset();
        }
    }

    public rollback() : void {
        try
        {
            if (this.unitOfWork) {
                this.unitOfWork.rollback();
            }
        }
        finally
        {
            this.reset();
        }
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
    }
}