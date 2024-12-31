-- Up Migration
CREATE TABLE IF NOT EXISTS BranchOpeningHours (
    branchOpeningHoursId SERIAL PRIMARY KEY,
    branchId INT NOT NULL REFERENCES Branches(branchId),
    dayOfWeek INT NOT NULL CHECK (dayOfWeek BETWEEN 0 AND 6),
    openingTime INT NOT NULL,
    closingTime INT NOT NULL,
    CHECK (
        openingTime >= 0 AND 
        closingTime <= 2400 AND 
        openingTime < closingTime
    ),
    EXCLUDE USING gist (
        branchId WITH =, 
        dayOfWeek WITH =,
        int4range(openingTime, closingTime) WITH &&
    )
);

-- Down Migration
DROP TABLE IF EXISTS BranchOpeningHours;