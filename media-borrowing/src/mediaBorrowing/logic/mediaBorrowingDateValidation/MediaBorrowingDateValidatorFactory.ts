import { IDbContext } from "../../../db/interfaces/dbContext"
import { IMediaBorrowingDateValidatorFactory } from "../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidatorFactory"
import { IMediaBorrowingDateValidator } from "../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator"
import { MediaBorrowingDateValidator } from "./MediaBorrowingDateValidator"

export class MediaBorrowingDateValidatorFactory extends IMediaBorrowingDateValidatorFactory {
    constructor(dbContext : IDbContext) {
        super()
        this.dbContext = dbContext
    }

    public create() : IMediaBorrowingDateValidator {
        return new MediaBorrowingDateValidator(this.dbContext)
    }
}