-- Up Migration
CREATE UNIQUE INDEX IF NOT EXISTS Users_UUID
ON Users(UserUUID);

-- Down Migration
DROP INDEX Users_UUID;