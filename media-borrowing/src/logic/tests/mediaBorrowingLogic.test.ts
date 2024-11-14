import 'reflect-metadata';
import Container from "typedi";
import { MediaBorrowingLogic } from "../mediaBorrowingLogic";
import { UserRepository } from '../../data/user';
import { FakeUserRepository, FakeMediaInventoryRepository, FakeMediaBorrowingRepository } from './mocks';
import { MediaInventoryRepository } from '../../data/inventory';
import { MediaBorrowingRepository } from '../../data/borrowing';

const fakeUserRepository = new FakeUserRepository()
const fakeMediaInventoryRepository = new FakeMediaInventoryRepository()
const fakeMediaBorrowingRepository = new FakeMediaBorrowingRepository()

Container.set(UserRepository, fakeUserRepository)
Container.set(MediaInventoryRepository, fakeMediaInventoryRepository)
Container.set(MediaBorrowingRepository, fakeMediaBorrowingRepository)

const mediaBorrowingLogic = Container.get(MediaBorrowingLogic)

beforeEach(() => {
    fakeUserRepository.setValidUser()
    fakeMediaInventoryRepository.setIsValidMediaItem(true)
    fakeMediaInventoryRepository.setMediaItemIsAvailable(true)
    fakeMediaBorrowingRepository.setRecordExists(false)
})

describe('Borrow Media Item', () => {
    test('A media item can be borrowed.', () => {
        const startDate = new Date()
        const endDate = new Date(startDate)

        endDate.setDate(endDate.getDate() + 14)

        mediaBorrowingLogic.borrowMediaItem(1, 10, startDate, endDate)
        expect(fakeMediaBorrowingRepository.hasRecordBeenInserted()).toBe(true)
    });

    test('A media item cannot be borrowed with an end date that is earlier than the given start date.', () => {
        const startDate = new Date()
        const endDate = new Date(startDate)

        endDate.setDate(endDate.getDate() - 1)

        expect(() => {mediaBorrowingLogic.borrowMediaItem(1, 10, startDate, endDate)}).toThrow()
    })

    test('A non-existent user cannot borrow a media item.', () => {
        const startDate = new Date()
        const endDate = new Date(startDate)

        endDate.setDate(endDate.getDate() + 14)

        fakeUserRepository.setInvalidUser()

        expect(() => {mediaBorrowingLogic.borrowMediaItem(3877387, 10, startDate, endDate)}).toThrow()
    })

    test('A non-existent media item cannot be borrowed.', () => {
        const startDate = new Date()
        const endDate = new Date(startDate)

        endDate.setDate(endDate.getDate() + 14)

        fakeMediaInventoryRepository.setIsValidMediaItem(false)

        expect(() => {mediaBorrowingLogic.borrowMediaItem(1, 4747733, startDate, endDate)}).toThrow()
    })

    test('An unavailable media item cannot be borrowed.', () => {
        const startDate = new Date()
        const endDate = new Date(startDate)

        endDate.setDate(endDate.getDate() + 14)

        fakeMediaInventoryRepository.setMediaItemIsAvailable(false)

        expect(() => {mediaBorrowingLogic.borrowMediaItem(1, 474, startDate, endDate)}).toThrow()
    })

    test('Users cannot borrow several copies of the same media item.', () => {
        const startDate = new Date()
        const endDate = new Date(startDate)

        endDate.setDate(endDate.getDate() + 14)

        fakeMediaBorrowingRepository.setRecordExists(true)

        expect(() => {mediaBorrowingLogic.borrowMediaItem(1, 10, startDate, endDate)}).toThrow()
    })
});