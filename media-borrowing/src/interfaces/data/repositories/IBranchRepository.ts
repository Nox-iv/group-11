import { BranchOpeningHours } from "../../dto/BranchOpeningHours";
import { Message } from "../../messaging/Message";
import { NotImplementedError } from "../../errors/notImplementedError";

export class IBranchRepository {
    constructor() {}

    getOpeningHoursById(branchId : number) : Promise<Message<BranchOpeningHours>> {
        throw new NotImplementedError()
    }
}