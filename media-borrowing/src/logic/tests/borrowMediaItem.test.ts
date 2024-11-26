import { IDbContext } from "../../interfaces/data/uow";
import { IMediaBorrowingRepository } from "../../interfaces/data/repositories";
import { IMediaBorrowingLogic } from "../../interfaces/logic/IMediaBorrowingLogic";
import { MediaBorrowingLogic } from "../MediaBorrowingLogic";
import { MediaBorrowingRecord } from "../../interfaces/dto";
import exp from "constants";
import { InvalidBorrowingDateError } from "../errors/invalidBorrowingDateError";

jest.mock("../../interfaces/data/uow")
jest.mock("../../interfaces/data/repositories")

let mockMediaBorrowingRepository : jest.Mocked<IMediaBorrowingRepository>;
let mockDbContext : jest.Mocked<IDbContext>
let mediaBorrowingLogic : IMediaBorrowingLogic
let genericMediaBorrowingRecord : MediaBorrowingRecord;

beforeEach(() => {
    // Setup mock media borrowing repository.
    mockMediaBorrowingRepository = new IMediaBorrowingRepository() as jest.Mocked<IMediaBorrowingRepository>;

    // Setup mock DB context.
    mockDbContext = new IDbContext() as jest.Mocked<IDbContext>;
    mockDbContext.getMediaBorrowingRepository.mockResolvedValue(mockMediaBorrowingRepository)

    // Setup media borrowing logic.
    mediaBorrowingLogic = new MediaBorrowingLogic()

    // Setup data.
    genericMediaBorrowingRecord = {
        userId: 1,
        mediaId: 1,
        startDate: new Date(),
        endDate: new Date(),
        renewals: 0
    }

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 14)

    genericMediaBorrowingRecord.endDate = endDate
});

describe("A user cannot borrow a media item if ...", () => {
    test("the start date has been set to a date later than the end date.", () => {
        genericMediaBorrowingRecord.startDate = new Date(genericMediaBorrowingRecord.endDate)
        genericMediaBorrowingRecord.startDate.setDate(genericMediaBorrowingRecord.startDate.getDate() + 1)

        const result = mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(result.value).toBe(false)
    })

    test("the end date is less than one day after the start date.", () => {
        genericMediaBorrowingRecord.endDate = new Date(genericMediaBorrowingRecord.startDate)
        genericMediaBorrowingRecord.endDate.setHours(genericMediaBorrowingRecord.endDate.getHours() + 1)

        const result = mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(result.value).toBe(false)
    })
})

