-- Up Migration
CREATE TABLE IF NOT EXISTS MediaInventory (
    mediaInventoryId SERIAL PRIMARY KEY,
    mediaId INT NOT NULL REFERENCES Media(mediaId),
    branchId INT NOT NULL REFERENCES Branches(branchId),
    availability INT NOT NULL CHECK(availability >= 0)
);

-- Down Migration
DROP TABLE IF EXISTS MediaInventory;