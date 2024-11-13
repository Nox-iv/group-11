import { UserService } from "../../../services/user"

export class FakeUserService extends UserService {
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