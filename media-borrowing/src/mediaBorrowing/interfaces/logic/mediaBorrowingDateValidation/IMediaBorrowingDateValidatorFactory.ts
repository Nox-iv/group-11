import { IDbContext } from "../../../../db/interfaces/dbContext";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { IFactory } from "../../../../shared/interfaces/IFactory";
import { IMediaBorrowingDateValidator } from "./IMediaBorrowingDateValidator";

export class IMediaBorrowingDateValidatorFactory implements IFactory<IMediaBorrowingDateValidator> {
    //@ts-ignore
    protected dbContext : IDbContext

    constructor() {}

    public create() : IMediaBorrowingDateValidator {
        throw new NotImplementedError()
    }
}