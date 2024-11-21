-- Up Migration
CREATE UNIQUE INDEX IF NOT EXISTS MediaBorrowingRecord_UserID
ON MediaBorrowingRecord(UserID);

-- Down Migration
DROP INDEX MediaBorrowingRecord_UserID;