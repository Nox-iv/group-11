import 'reflect-metadata';
import Container from "typedi";
import { MediaBorrowingLogic } from "../mediaBorrowingLogic";
import { UserRepository } from '../../data/user';
import { FakeUserRepository } from './mocks/fakeUserRepository';

const fakeUserRepository = new FakeUserRepository()
Container.set(UserRepository, fakeUserRepository)

const mediaBorrowingLogic = Container.get(MediaBorrowingLogic)

afterEach(() => {
    fakeUserRepository.setValidUser()
})

describe('Update media borrowing record', () => {
    test('User with ID 1 borrows media item with ID 10 with a due date two weeks from the current date.', () => {
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
});