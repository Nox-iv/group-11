import { IUserRepository } from "../data/user/interfaces/userRepository.type"

export class FakeUserRepository implements IUserRepository {
    private isValidUser: boolean

    constructor() {
        this.isValidUser = true
    }

    isValidUserId(userId: number): boolean {
        return this.isValidUser
    }

    setValidUser() {
        this.isValidUser = true
    }

    setInvalidUser() {
        this.isValidUser = false
    }
}