-- Up Migration
CREATE TABLE MediaBorrowingRecord (
    MediaBorrowingRecordID SERIAL PRIMARY KEY,
    MediaBorrowingRecordUUID UUID NOT NULL UNIQUE,              
    UserID INTEGER NOT NULL,    
    MediaID INTEGER NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Renewals INTEGER NOT NULL               
);

-- Down Migration
DROP TABLE MediaBorrowingRecord;