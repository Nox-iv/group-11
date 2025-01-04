-- Up Migration
CREATE TABLE IF NOT EXISTS MediaBorrowingConfig (
    mediaBorrowingConfigId SERIAL PRIMARY KEY,
    renewalLimit INT NOT NULL,
    maximumBorrowingDurationInDays INT NOT NULL
);

-- Down Migration
DROP TABLE MediaBorrowingConfig;