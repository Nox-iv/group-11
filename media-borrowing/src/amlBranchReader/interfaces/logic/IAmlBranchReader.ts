import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { Message } from "../../../shared/messaging/Message";
import { BranchReadModel } from "../../data/models/BranchReadModel";
import { IAmlBranchReaderRepository } from "../data/repositories/IAmlBranchReaderRepository";

export class IAmlBranchReader {
    //@ts-ignore
    protected amlBranchReaderRepository : IAmlBranchReaderRepository

    constructor() {}

    public getBranchesByLocationId(locationId: number) : Promise<Message<BranchReadModel[]>> {
        throw new NotImplementedError()
    }
}