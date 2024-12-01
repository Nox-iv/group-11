import { BranchOpeningHours } from "../../../../mediaBorrowing/data/models";
import { Message } from "../../../../shared/messaging/Message";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";

export class IBranchRepository {
    constructor() {}

    getOpeningHoursById(branchId : number) : Promise<Message<BranchOpeningHours>> {
        throw new NotImplementedError()
    }

    getBranchLocationId(branchId : number) : Promise<number> {
        throw new NotImplementedError()
    }
}