-- Up Migration
CREATE INDEX idx_media_inventory_media_id_branch_id ON MediaInventory (mediaId, branchId);

-- Down Migration
DROP INDEX idx_media_inventory_media_id_branch_id;