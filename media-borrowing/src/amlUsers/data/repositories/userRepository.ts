import { IUserRepository } from "../../interfaces/data/repositories/IUserRepository";
import { IUnitOfWork } from "../../../db/interfaces/uow";
import { Message } from "../../../shared/messaging/Message";

export class UserRepository extends IUserRepository {
    private uow : IUnitOfWork
    
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    hasUser(userId: number): Promise<Message<boolean>> {
        const result = new Message(false)

        return new Promise(() => null)
    }
} 