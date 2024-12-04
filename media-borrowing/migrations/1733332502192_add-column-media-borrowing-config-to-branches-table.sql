-- Up Migration
ALTER TABLE Branches ADD COLUMN mediaBorrowingConfigId INT REFERENCES MediaBorrowingConfig(mediaBorrowingConfigId);

-- Down Migration
ALTER TABLE Branches DROP COLUMN mediaBorrowingConfigId;