import { Service } from "typedi";
import { IUserRepository } from "./interfaces/userRepository.type";

@Service()
export class UserRepository implements IUserRepository {
    constructor() {}

    isValidUserId(userId: number): boolean {
        return true
    }
}