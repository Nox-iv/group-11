-- Up Migration
CREATE TABLE IF NOT EXISTS ArchivedMediaBorrowingRecords (
    archivedMediaBorrowingRecordId SERIAL PRIMARY KEY,
    mediaBorrowingRecordId INT NOT NULL,
    userId INT NOT NULL,
    mediaId INT NOT NULL,
    branchId INT NOT NULL,
    startDate TIMESTAMPTZ NOT NULL,
    endDate TIMESTAMPTZ NOT NULL,
    returnedDate TIMESTAMPTZ NOT NULL,
    renewals INT NOT NULL
);

-- Down Migration
DROP TABLE IF EXISTS ArchivedMediaBorrowingRecords;