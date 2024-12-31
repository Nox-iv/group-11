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

CREATE TABLE subscriptionBilling (
    billing_id SERIAL PRIMARY KEY,
    subscription_id INT,
    payment_amount DECIMAL(10, 2),
    payment_method VARCHAR(50),  
    payment_status VARCHAR(20),  
    billing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES memberSubscription(id)
);

-- Add status column to memberSubscription
ALTER TABLE memberSubscription
ADD COLUMN status VARCHAR(20) DEFAULT 'active',
ADD COLUMN auto_renew BOOLEAN DEFAULT true;

--Add member name 
ALTER TABLE memberSubscription
ADD COLUMN first_name VARCHAR(50),
ADD COLUMN last_name VARCHAR(50);
