-- Up Migration
CREATE INDEX IF NOT EXISTS idx_branches_location_id ON Branches(locationId);

-- Down Migration
DROP INDEX IF EXISTS idx_branches_location_id;