import { IUserRepository } from "../../interfaces/data/repositories/IUserRepository";
import { IUnitOfWork } from "../../../db/interfaces/uow";
import { User } from "../models/user";
import { UserEntity } from "../entities/userEntity";

export class UserRepository extends IUserRepository {
    private uow : IUnitOfWork
    
    constructor(uow : IUnitOfWork) {
        super()
        this.uow = uow
    }

    public async getUser(userId : number) : Promise<User | null> {
        const connection = this.uow.getTransaction().getConnection()
        const result = await connection.query<UserEntity>("SELECT * FROM Users WHERE userId = $1", [userId])

        if (result.length === 0) {
            return null
        }

        const userEntity = result[0]
        
        return {
            userId : userEntity.userid,
            locationId : userEntity.locationid
        }
    }
} 