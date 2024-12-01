import { Message } from "../../../../shared/messaging/Message";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { User } from "../../../data/models/user";

export class IUserRepository {
    hasUser(userId: number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }

    public getUser(userId : number) : Promise<User> {
        throw new NotImplementedError()
    }
 }