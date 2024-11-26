import { NotImplementedError } from "../../errors/notImplementedError";
import { IMediaBorrowingRepository } from "../repositories";

export class IDbContext {
    constructor() {}

    public getMediaBorrowingRepository() : Promise<IMediaBorrowingRepository> {
        throw new NotImplementedError()
    }

    public commit() : void {
        throw new NotImplementedError()
    }

    public rollback() : void {
        throw new NotImplementedError()
    }
}