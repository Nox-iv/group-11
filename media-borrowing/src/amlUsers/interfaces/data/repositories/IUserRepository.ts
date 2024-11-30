import { Message } from "../../../../shared/messaging/Message";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";

export class IUserRepository {
    hasUser(userId: number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}