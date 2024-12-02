import { BranchOpeningHours } from "../../../../mediaBorrowing/data/models";
import { IUnitOfWork } from "../../../../db/interfaces/uow";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";

export class IBranchRepository {
    //@ts-ignore
    protected uow : IUnitOfWork
    constructor() {}

    getOpeningHoursById(branchId : number) : Promise<BranchOpeningHours | null> {
        throw new NotImplementedError()
    }

    getBranchLocationId(branchId : number) : Promise<number | null> {
        throw new NotImplementedError()
    }
}