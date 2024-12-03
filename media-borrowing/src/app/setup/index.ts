import { Pool } from "pg";
import { DbConnectionFactory } from "../../db/connection/dbConnectionFactory";
import { UnitOfWorkFactory } from "../../db/uow/UnitOfWorkFactory";
import { setupMediaBorrowing } from "./mediaBorrowingSetup";
import { setupMediaBorrowingReader } from "./mediaBorrowingReaderSetup";
import { IUnitOfWorkFactory } from "../../db/interfaces/uow/IUnitOfWorkFactory";
import Container from "typedi";
import { DbContextFactory } from "../../db/dbContext/dbContextFactory";
import { IDbContextFactory } from "../../db/interfaces/dbContext/IDbContextFactory";
import { setupApi } from "./api";

export function setup(dbConnectionPool : Pool) {
    const dbConnectionFactory = new DbConnectionFactory(dbConnectionPool)

    const uowFactory = new UnitOfWorkFactory(dbConnectionFactory)
    Container.set(IUnitOfWorkFactory, uowFactory)

    const dbContextFactory = new DbContextFactory()
    Container.set(IDbContextFactory, dbContextFactory)

    // API setup must be called last
    setupMediaBorrowing(dbContextFactory)
    setupMediaBorrowingReader(dbConnectionFactory)
    setupApi()
}