-- Up Migration
CREATE TABLE IF NOT EXISTS MediaBorrowingRecords (
    mediaBorrowingRecordId SERIAL PRIMARY KEY,
    userId INT NOT NULL REFERENCES Users(userId),
    mediaId INT NOT NULL REFERENCES Media(mediaId),
    branchId INT NOT NULL REFERENCES Branches(branchId),
    startDate TIMESTAMPTZ NOT NULL,
    endDate TIMESTAMPTZ NOT NULL,
    renewals INT NOT NULL
);

-- Down Migration
DROP TABLE IF EXISTS MediaBorrowingRecords;