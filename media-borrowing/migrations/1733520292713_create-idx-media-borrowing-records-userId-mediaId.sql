-- Up Migration
CREATE INDEX idx_media_borrowing_records_user_id_media_id ON MediaBorrowingRecords (userId, mediaId);

-- Down Migration
DROP INDEX idx_media_borrowing_records_user_id_media_id;