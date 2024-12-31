import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { BranchReadModel } from "../../../data/models/BranchReadModel";
import { IDbConnectionFactory } from  "../../../../db/interfaces/connection/IDbConnectionFactory";

export class IAmlBranchReaderRepository {
    //@ts-ignore
    protected dbConnectionFactory: IDbConnectionFactory

    constructor() {}
    
    public getBranchesByLocationId(locationId: number) : Promise<BranchReadModel[] | null> {
        throw new NotImplementedError()
    }
}