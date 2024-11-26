import { Inject } from "typedi"
import { IUnitOfWorkFactory, IUnitOfWork, IDbContext } from "../../interfaces/data/uow"
import { IMediaBorrowingRepository } from "../../interfaces/data/repositories"
import { MediaBorrowingRepository } from "../../data"

export class DbContext extends IDbContext {
    private unitOfWork : IUnitOfWork | null
    private unitOfWorkFactory : IUnitOfWorkFactory
    private mediaBorrowingRepository : IMediaBorrowingRepository | null

    constructor(
        @Inject() unitOfWorkFactory : IUnitOfWorkFactory
    ) {
        super()
        this.unitOfWorkFactory = unitOfWorkFactory
        this.unitOfWork = null
        this.mediaBorrowingRepository = null
    }

    public async getMediaBorrowingRepository() : Promise<IMediaBorrowingRepository> {
        if (this.mediaBorrowingRepository == null) {
            this.mediaBorrowingRepository = new MediaBorrowingRepository(await this.getUnitOfWork())
        }

        return this.mediaBorrowingRepository
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
    }
}