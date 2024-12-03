import Container from "typedi";
import { MediaBorrowingLogic } from "../../mediaBorrowing/logic/mediaBorrowing";
import { IMediaBorrowingLogic } from "../../mediaBorrowing/interfaces/logic/mediaBorrowing/IMediaBorrowingLogic";
import { MediaBorrowingDateValidator } from "../../mediaBorrowing/logic/mediaBorrowingDateValidation";
import { IDbContextFactory } from "../../db/interfaces/dbContext";
import { MediaInventoryLogic } from "../../mediaInventory/logic/mediaInventoryLogic";
import { UserEligibilityLogic } from "../../amlUsers/logic/UserEligibilityLogic";
import { IMediaRenewalLogic } from "../../mediaBorrowing/interfaces/logic/mediaRenewals/IMediaRenewalLogic";
import { MediaRenewalLogic } from "../../mediaBorrowing/logic/mediaRenewals";
import { MediaReturnLogic } from "../../mediaBorrowing/logic/mediaReturns";
import { IMediaReturnLogic } from "../../mediaBorrowing/interfaces/logic/mediaReturns/IMediaReturnLogic";

export function setupMediaBorrowing(dbContextFactory : IDbContextFactory) {
    const mediaBorrowingDateValidator = new MediaBorrowingDateValidator(dbContextFactory)
    const userEligibilityLogic = new UserEligibilityLogic(dbContextFactory)
    const mediaInventoryLogic = new MediaInventoryLogic(dbContextFactory)

    const mediaBorrowingLogic = new MediaBorrowingLogic(
        dbContextFactory, 
        userEligibilityLogic, 
        mediaInventoryLogic,
        mediaBorrowingDateValidator
    )
    Container.set(IMediaBorrowingLogic, mediaBorrowingLogic)

    const mediaRenewalLogic = new MediaRenewalLogic(dbContextFactory, mediaBorrowingDateValidator)
    Container.set(IMediaRenewalLogic, mediaRenewalLogic)

    const mediaReturnLogic = new MediaReturnLogic(dbContextFactory, mediaInventoryLogic)
    Container.set(IMediaReturnLogic, mediaReturnLogic)
}