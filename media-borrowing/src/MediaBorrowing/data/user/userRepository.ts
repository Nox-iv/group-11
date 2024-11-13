import { Service } from "typedi";

@Service()
export class UserRepository {
    constructor() {}

    isValidUserId(userId: number): boolean {
        return true
    }
}