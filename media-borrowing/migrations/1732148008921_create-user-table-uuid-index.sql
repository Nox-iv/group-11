-- Up Migration
CREATE UNIQUE INDEX IF NOT EXISTS Media_UUID
ON Media(MediaUUID);

-- Down Migration
DROP INDEX Media_UUID;