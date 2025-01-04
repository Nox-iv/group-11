import { Message } from "../../../../shared/messaging/Message";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { User } from "../../../data/models/user";

export class IUserRepository {
    public getUser(userId : number) : Promise<User | null> {
        throw new NotImplementedError()
    }
 }