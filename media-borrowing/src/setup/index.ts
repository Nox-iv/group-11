import 'reflect-metadata'
import { Container } from 'typedi'
import { MediaBorrowingRepository } from "../data";
import { IMediaBorrowingRepository } from "../interfaces";

export function setupDependencies() {
    Container.set(IMediaBorrowingRepository, MediaBorrowingRepository)
}