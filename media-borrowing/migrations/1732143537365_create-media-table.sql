-- Up Migration
CREATE TABLE Media (
    MediaID SERIAL PRIMARY KEY,                
    MediaUUID UUID NOT NULL UNIQUE,            
    Quantity INTEGER NOT NULL               
);

-- Down Migration
DROP TABLE Media;