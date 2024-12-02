import { IUserRepository } from "../../interfaces/data/repositories/IUserRepository";
import { IUnitOfWork } from "../../../db/interfaces/uow";
import { User } from "../models/user";

export class UserRepository extends IUserRepository {
    private uow : IUnitOfWork
    
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async getUser(userId : number) : Promise<User> {
        const connection = this.uow.getTransaction().getConnection()
        const user = await connection.query<User>("SELECT * FROM Users WHERE id = $1", [userId])

        return user[0]
    }
} 