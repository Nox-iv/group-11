-- Up Migration
CREATE TABLE IF NOT EXISTS Locations (
    locationId SERIAL PRIMARY KEY,
    locationName VARCHAR(255) NOT NULL
);

-- Down Migration
DROP TABLE Locations;