-- Up Migration
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    UserUUID UUID NOT NULL UNIQUE
);

-- Down Migration
DROP TABLE Users;