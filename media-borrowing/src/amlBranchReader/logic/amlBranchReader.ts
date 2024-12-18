import { BranchReadModel } from "../data/models/BranchReadModel"
import { IAmlBranchReader } from "../interfaces/logic/IAmlBranchReader"
import { IAmlBranchReaderRepository } from "../interfaces/data/repositories/IAmlBranchReaderRepository"
import { Message } from "../../shared/messaging/Message"

export class AmlBranchReader extends IAmlBranchReader {
    constructor(amlBranchReaderRepository : IAmlBranchReaderRepository) {
        super()
        this.amlBranchReaderRepository = amlBranchReaderRepository
    }

    public async getBranchesByLocationId(locationId: number): Promise<Message<BranchReadModel[]>> {
        const result = new Message<BranchReadModel[]>([])

        try {
            const branches = await this.amlBranchReaderRepository.getBranchesByLocationId(locationId)
            
            if (branches != null) {
                result.value = branches
            }
        } catch(e) {
            result.addError(e as Error)
        } finally {
            return result
        }
    }
}