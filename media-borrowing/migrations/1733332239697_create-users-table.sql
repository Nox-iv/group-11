-- Up Migration
CREATE TABLE IF NOT EXISTS Users (
    userId SERIAL PRIMARY KEY,
    locationId INT NOT NULL REFERENCES Locations(locationId),
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    emailAddress VARCHAR(100) NOT NULL UNIQUE,
    phoneNumber VARCHAR(15) UNIQUE
);

-- Down Migration
DROP TABLE IF EXISTS Users;