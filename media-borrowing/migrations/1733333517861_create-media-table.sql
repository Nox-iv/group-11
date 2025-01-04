-- Up Migration
CREATE TABLE IF NOT EXISTS Media (
    mediaId SERIAL PRIMARY KEY,
    mediaTypeId INT NOT NULL REFERENCES MediaTypes(mediaTypeId),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    assetUrl VARCHAR(255) NOT NULL
);

-- Down Migration
DROP TABLE IF EXISTS Media;