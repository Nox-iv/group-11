CREATE DATABASE subscription;

CREATE TABLE subscriptionType (
     subId SERIAL PRIMARY KEY,
     subType VARCHAR(20),
     price  DECIMAL(10, 2),
     duration INTERVAL 
)

CREATE TABLE memberSubscription (
    id SERIAL PRIMARY KEY,
    member_id INT,
    subId INT,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    end_date TIMESTAMP,
    FOREIGN KEY (subId) REFERENCES subscriptionType(subId)
)


 