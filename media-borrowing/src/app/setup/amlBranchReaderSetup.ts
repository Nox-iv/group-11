import Container from "typedi"
import { IAmlBranchReader } from "../../amlBranchReader/interfaces/logic/IAmlBranchReader"
import { AmlBranchReader } from "../../amlBranchReader/logic/amlBranchReader"
import { AmlBranchReaderRepository } from "../../amlBranchReader/data/repositories/amlBranchReaderRepository"
import { IDbConnectionFactory } from "../../db/interfaces/connection/IDbConnectionFactory"

export const setupAmlBranchReaderApi = (dbConnectionFactory : IDbConnectionFactory) => {
    const amlBranchReaderRepository = new AmlBranchReaderRepository(dbConnectionFactory)

    const amlBranchReader = new AmlBranchReader(amlBranchReaderRepository)
    Container.set(IAmlBranchReader, amlBranchReader)
}