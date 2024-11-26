import { Message } from "../../messaging/Message";
import { NotImplementedError } from "../../errors/notImplementedError";

export class IUserRepository {
    hasUser(userId: number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}