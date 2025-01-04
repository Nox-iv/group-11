-- Up Migration
CREATE TABLE IF NOT EXISTS Branches (
    branchId SERIAL PRIMARY KEY,
    locationId INT NOT NULL REFERENCES Locations(locationId),
    mediaBorrowingConfigId INT NOT NULL REFERENCES MediaBorrowingConfig(mediaBorrowingConfigId),
    branchName VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Down Migration
DROP TABLE Branches;