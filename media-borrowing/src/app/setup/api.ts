import Container from "typedi"
import { HttpErrorHandler } from "../../shared/http/httpErrorHandler"
import { IMediaBorrowingLogic } from "../../mediaBorrowing/interfaces/logic/mediaBorrowing/IMediaBorrowingLogic"
import { MediaBorrowingApi } from "../../mediaBorrowing/api/mediaBorrowingApi"
import { IMediaRenewalLogic } from "../../mediaBorrowing/interfaces/logic/mediaRenewals/IMediaRenewalLogic"
import { IMediaReturnLogic } from "../../mediaBorrowing/interfaces/logic/mediaReturns/IMediaReturnLogic"
import { IMediaBorrowingReader } from "../../mediaBorrowingReader/interfaces/logic/IMediaBorrowingReader"
import { MediaBorrowingReaderApi } from "../../mediaBorrowingReader/api/mediaBorrowingReaderApi"
import { AmlBranchReaderApi } from "../../amlBranchReader/api/amlBranchReaderApi"
import { IAmlBranchReader } from "../../amlBranchReader/interfaces/logic/IAmlBranchReader"

export function setupApi() {
    const httpErrorHandler = new HttpErrorHandler()
    Container.set(HttpErrorHandler, httpErrorHandler)

    const mediaBorrowingApi = new MediaBorrowingApi(
        Container.get(IMediaBorrowingLogic),
        Container.get(IMediaRenewalLogic),
        Container.get(IMediaReturnLogic),
        Container.get(HttpErrorHandler)
    )   

    Container.set(MediaBorrowingApi, mediaBorrowingApi)

    const mediaBorrowingReaderApi = new MediaBorrowingReaderApi(
        Container.get(IMediaBorrowingReader),
        Container.get(HttpErrorHandler)
    )

    Container.set(MediaBorrowingReaderApi, mediaBorrowingReaderApi)

    const amlBranchReaderApi = new AmlBranchReaderApi(
        Container.get(IAmlBranchReader),
        Container.get(HttpErrorHandler)
    )

    Container.set(AmlBranchReaderApi, amlBranchReaderApi)
}