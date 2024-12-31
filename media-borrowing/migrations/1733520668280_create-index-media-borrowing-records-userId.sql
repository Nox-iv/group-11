-- Up Migration
CREATE INDEX idx_media_borrowing_records_user_id ON MediaBorrowingRecords (userId);

-- Down Migration
DROP INDEX idx_media_borrowing_records_user_id;