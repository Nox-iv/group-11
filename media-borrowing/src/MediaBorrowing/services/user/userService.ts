import { Service } from "typedi";

@Service()
export class UserService {
    constructor() {}

    isValidUserId(userId: number): boolean {
        return true
    }
}