import { IDbContext } from "../../../db/interfaces/dbContext"
import { IMediaBorrowingDateValidator } from "../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator"
import { MediaBorrowingDateValidator } from "./MediaBorrowingDateValidator"

export class MediaBorrowingDateValidatorFactory {
    constructor() {}

    public getMediaBorrowingDateValidator(dbContext : IDbContext) : IMediaBorrowingDateValidator {
        return new MediaBorrowingDateValidator(dbContext)
    }
}