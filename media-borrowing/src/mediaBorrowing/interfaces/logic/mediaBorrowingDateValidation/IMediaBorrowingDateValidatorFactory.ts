import { IDbContext } from "../../../../db/interfaces/dbContext";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { IMediaBorrowingDateValidator } from "./IMediaBorrowingDateValidator";

export class IMediaBorrowingDateValidatorFactory {
    constructor() {}

    public getMediaBorrowingDateValidator(dbContext : IDbContext) : IMediaBorrowingDateValidator {
        throw new NotImplementedError()
    }
}