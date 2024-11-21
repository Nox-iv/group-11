-- Up Migration
CREATE UNIQUE INDEX IF NOT EXISTS MediaBorrowingRecord_UserID_MediaID
ON MediaBorrowingRecord(UserID, MediaId);

-- Down Migration
DROP INDEX MediaBorrowingRecord_UserID_MediaID;