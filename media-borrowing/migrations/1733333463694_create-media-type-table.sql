-- Up Migration
CREATE TABLE IF NOT EXISTS MediaTypes (
    mediaTypeId SERIAL PRIMARY KEY,
    mediaTypeName VARCHAR(255) NOT NULL UNIQUE
);

-- Down Migration
DROP TABLE IF EXISTS MediaTypes;