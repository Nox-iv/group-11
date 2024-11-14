import 'reflect-metadata';
import Container from "typedi";
import { MediaBorrowingLogic } from "../mediaBorrowingLogic";
import { UserRepository } from '../../data/user';
import { FakeUserRepository, FakeMediaInventoryRepository } from './mocks';
import { MediaInventoryRepository } from '../../data/inventory';

const fakeUserRepository = new FakeUserRepository()
const fakeMediaInventoryRepository = new FakeMediaInventoryRepository()

Container.set(UserRepository, fakeUserRepository)
Container.set(MediaInventoryRepository, fakeMediaInventoryRepository)

const mediaBorrowingLogic = Container.get(MediaBorrowingLogic)

afterEach(() => {
    fakeUserRepository.setValidUser()
    fakeMediaInventoryRepository.setIsValidMediaItem(true)
    fakeMediaInventoryRepository.setMediaItemIsAvailable(true)
})

describe('Borrow Media Item', () => {
    test('A user with ID 1 borrows media item with ID 10 for 14 days.', () => {
        const startDate = new Date()
        const endDate = new Date(startDate)

        endDate.setDate(endDate.getDate() + 14)

        const result = mediaBorrowingLogic.borrowMediaItem(1, 10, startDate, endDate)

        expect(result.userId).toBe(1)
        expect(result.mediaItemId).toBe(10)
        expect(result.startDate.getTime()).toBe(startDate.getTime())
        expect(result.endDate.getTime()).toBe(endDate.getTime())
        expect(result.renewals).toBe(0)
    });

    test('An item cannot be borrowed with a start date after than the end date', () => {
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
});