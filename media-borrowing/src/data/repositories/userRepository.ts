import { IUserRepository } from "../../interfaces/data/repositories";
import { IUnitOfWork } from "../../interfaces/data/uow";
import { Message } from "../../interfaces/messaging/Message";

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