import { Service } from "typedi";
import { IUserRepository } from ".";

@Service()
export class UserRepository implements IUserRepository {
    constructor() {}

    isValidUserId(userId: number): boolean {
        return true
    }
}