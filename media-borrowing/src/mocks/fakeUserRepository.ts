import { UserRepository } from "../data/user"

export class FakeUserRepository extends UserRepository {
    private isValidUser: boolean

    constructor() {
        super()
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