-- Up Migration
CREATE INDEX idx_branch_opening_hours_branch_id ON BranchOpeningHours (branchId);

-- Down Migration
DROP INDEX idx_branch_opening_hours_branch_id;